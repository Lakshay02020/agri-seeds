const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const url = urlMatch ? urlMatch[1].trim() : '';
const key = keyMatch ? keyMatch[1].trim() : '';
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('products').select('*, categories(name), product_images(image_url)').eq('slug', 'tomato-hybrid-seeds').single();
  console.log("Error:", error);
  console.log("Data:", JSON.stringify(data, null, 2));
}
run();
