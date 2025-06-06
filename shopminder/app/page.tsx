"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { Plus, ShoppingCart, Trash2, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import Auth from "@/components/auth"
import { isSupabaseConfigured } from "@/lib/supabase"
import ConfigError from "@/components/config-error"
import Logo from "@/components/logo"

interface ShoppingItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  purchased: boolean
  list_id: string
}

interface ShoppingList {
  id: string
  name: string
  items?: ShoppingItem[]
  created_at: string
  user_id: string
}

const categories = [
  "Fruits et légumes",
  "Boucherie/Charcuterie",
  "Poissonnerie",
  "Produits laitiers",
  "Épicerie salée",
  "Épicerie sucrée",
  "Surgelés",
  "Boissons",
  "Hygiène/Beauté",
  "Entretien",
  "Boulangerie",
  "Autres",
]

const units = ["pièce(s)", "kg", "g", "L", "mL", "paquet(s)", "boîte(s)", "bouteille(s)"]

export default function ShoppingListApp() {
  const [user, setUser] = useState<User | null>(null)
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null)
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    unit: "pièce(s)",
    category: "Autres",
  })

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Charger les listes quand l'utilisateur se connecte
  useEffect(() => {
    if (user) {
      loadLists()
    } else {
      setLists([])
      setSelectedList(null)
    }
  }, [user])

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return <ConfigError />
  }

  const loadLists = async () => {
    if (!user) return

    const { data: listsData, error } = await supabase
      .from("shopping_lists")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur lors du chargement des listes:", error)
      return
    }

    setLists(listsData || [])
  }

  const loadListItems = async (listId: string) => {
    const { data: itemsData, error } = await supabase
      .from("shopping_items")
      .select("*")
      .eq("list_id", listId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Erreur lors du chargement des articles:", error)
      return []
    }

    return itemsData || []
  }

  const createList = async () => {
    if (!newListName.trim() || !user) return

    const { data, error } = await supabase
      .from("shopping_lists")
      .insert([
        {
          name: newListName,
          user_id: user.id,
        },
      ])
      .select()

    if (error) {
      console.error("Erreur lors de la création de la liste:", error)
      return
    }

    setNewListName("")
    setIsCreateListOpen(false)
    loadLists()
  }

  const deleteList = async (listId: string) => {
    const { error } = await supabase.from("shopping_lists").delete().eq("id", listId)

    if (error) {
      console.error("Erreur lors de la suppression de la liste:", error)
      return
    }

    if (selectedList?.id === listId) {
      setSelectedList(null)
    }
    loadLists()
  }

  const selectList = async (list: ShoppingList) => {
    const items = await loadListItems(list.id)
    setSelectedList({ ...list, items })
  }

  const addItem = async () => {
    if (!selectedList || !newItem.name.trim()) return

    const { data, error } = await supabase
      .from("shopping_items")
      .insert([
        {
          list_id: selectedList.id,
          name: newItem.name,
          quantity: newItem.quantity,
          unit: newItem.unit,
          category: newItem.category,
        },
      ])
      .select()

    if (error) {
      console.error("Erreur lors de l'ajout de l'article:", error)
      return
    }

    const updatedItems = [...(selectedList.items || []), data[0]]
    setSelectedList({ ...selectedList, items: updatedItems })
    setNewItem({ name: "", quantity: 1, unit: "pièce(s)", category: "Autres" })
    setIsAddItemOpen(false)
  }

  const toggleItemPurchased = async (itemId: string) => {
    if (!selectedList) return

    const item = selectedList.items?.find((i) => i.id === itemId)
    if (!item) return

    const { error } = await supabase.from("shopping_items").update({ purchased: !item.purchased }).eq("id", itemId)

    if (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error)
      return
    }

    const updatedItems = selectedList.items?.map((i) => (i.id === itemId ? { ...i, purchased: !i.purchased } : i)) || []

    setSelectedList({ ...selectedList, items: updatedItems })
  }

  const deleteItem = async (itemId: string) => {
    if (!selectedList) return

    const { error } = await supabase.from("shopping_items").delete().eq("id", itemId)

    if (error) {
      console.error("Erreur lors de la suppression de l'article:", error)
      return
    }

    const updatedItems = selectedList.items?.filter((i) => i.id !== itemId) || []
    setSelectedList({ ...selectedList, items: updatedItems })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Fruits et légumes": "bg-green-100 text-green-800",
      "Boucherie/Charcuterie": "bg-red-100 text-red-800",
      Poissonnerie: "bg-blue-100 text-blue-800",
      "Produits laitiers": "bg-yellow-100 text-yellow-800",
      "Épicerie salée": "bg-orange-100 text-orange-800",
      "Épicerie sucrée": "bg-pink-100 text-pink-800",
      Surgelés: "bg-cyan-100 text-cyan-800",
      Boissons: "bg-purple-100 text-purple-800",
      "Hygiène/Beauté": "bg-indigo-100 text-indigo-800",
      Entretien: "bg-gray-100 text-gray-800",
      Boulangerie: "bg-amber-100 text-amber-800",
      Autres: "bg-slate-100 text-slate-800",
    }
    return colors[category as keyof typeof colors] || colors["Autres"]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Auth user={user} onAuthChange={setUser} />
  }

  if (selectedList) {
    const groupedItems = (selectedList.items || []).reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      },
      {} as Record<string, ShoppingItem[]>,
    )

    return (
      <div className="min-h-screen bg-gray-50">
        <Auth user={user} onAuthChange={setUser} />
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setSelectedList(null)} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Retour
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">{selectedList.name}</h1>
              </div>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter un article
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un article</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="itemName">Nom de l'article</Label>
                      <Input
                        id="itemName"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Ex: Pommes"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantity">Quantité</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unité</Label>
                        <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addItem} className="w-full">
                      Ajouter l'article
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {!selectedList.items || selectedList.items.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    Votre liste est vide. Commencez par ajouter des articles !
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className={getCategoryColor(category)}>{category}</Badge>
                        <span className="text-sm text-gray-500">
                          ({items.length} article{items.length > 1 ? "s" : ""})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              item.purchased ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox checked={item.purchased} onCheckedChange={() => toggleItemPurchased(item.id)} />
                              <div className={item.purchased ? "line-through text-gray-500" : ""}>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} {item.unit}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.purchased && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  <Check className="w-3 h-3 mr-1" />
                                  Acheté
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Auth user={user} onAuthChange={setUser} />
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Logo size="md" />
              <p className="text-gray-600 mt-2">Listes de courses intelligentes qui se souviennent pour vous</p>
            </div>
            <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouvelle liste
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle liste</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="listName">Nom de la liste</Label>
                    <Input
                      id="listName"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Ex: Courses de la semaine"
                    />
                  </div>
                  <Button onClick={createList} className="w-full">
                    Créer la liste
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {lists.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune liste de courses</h3>
                <p className="text-gray-500 text-center mb-6">
                  Créez votre première liste pour commencer à organiser vos courses
                </p>
                <Button onClick={() => setIsCreateListOpen(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Créer ma première liste
                </Button>
              </CardContent>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Conseil pour commencer :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Créez une liste (ex: "Supermarché du samedi")</li>
                  <li>• Ajoutez vos articles avec quantités</li>
                  <li>• Les articles se groupent par rayon automatiquement</li>
                  <li>• Cochez les articles achetés pendant vos courses</li>
                </ul>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lists.map((list) => (
                <Card key={list.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => selectList(list)}>
                        <CardTitle className="text-lg mb-2">{list.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          Créée le {new Date(list.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteList(list.id)
                        }}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
