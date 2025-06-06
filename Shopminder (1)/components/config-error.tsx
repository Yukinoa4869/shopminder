"use client"

import { ShoppingCart, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConfigError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Configuration requise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800">Variables d'environnement manquantes</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Les variables d'environnement Supabase ne sont pas configurées.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Comment configurer :</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li>
                Créez un compte sur{" "}
                <a
                  href="https://supabase.com"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Supabase.com
                </a>
              </li>
              <li>Créez un nouveau projet</li>
              <li>Exécutez le script SQL fourni dans l'éditeur SQL de Supabase</li>
              <li>Dans les paramètres du projet, trouvez l'URL et la clé API anonyme</li>
              <li>Ajoutez ces variables dans les paramètres de déploiement de votre plateforme</li>
            </ol>

            <div className="bg-gray-800 text-gray-200 p-3 rounded-md text-sm font-mono overflow-x-auto">
              <pre>
                NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
                <br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
              </pre>
            </div>

            <p className="text-sm text-gray-600">Après avoir configuré ces variables, redéployez l'application.</p>

            <Button onClick={() => window.location.reload()} className="w-full mt-4">
              Rafraîchir l'application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
