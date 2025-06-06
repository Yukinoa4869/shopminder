-- Créer la table des listes de courses
CREATE TABLE shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table des articles
CREATE TABLE shopping_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit TEXT DEFAULT 'pièce(s)',
  category TEXT DEFAULT 'Autres',
  purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index pour améliorer les performances
CREATE INDEX idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX idx_shopping_items_list_id ON shopping_items(list_id);

-- Activer RLS (Row Level Security)
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour shopping_lists
CREATE POLICY "Users can view their own lists" ON shopping_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lists" ON shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists" ON shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" ON shopping_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques de sécurité pour shopping_items
CREATE POLICY "Users can view items from their lists" ON shopping_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_items.list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items to their lists" ON shopping_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_items.list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items from their lists" ON shopping_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_items.list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their lists" ON shopping_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM shopping_lists 
      WHERE shopping_lists.id = shopping_items.list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );
