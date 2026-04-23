import os
from supabase import create_client, Client

SUPABASE_URL = "https://injjbsjvacobaconmtst.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluampic2p2YWNvYmFjb25tdHN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzNzQ5OSwiZXhwIjoyMDkyNTEzNDk5fQ.cYkSvdz8Af-ZvpeT2qWFQ-balVwnTc_Br3LAKA4GDsc"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    print("Testing emails...")
    res1 = supabase.table("emails").select("*").limit(1).execute()
    print("emails:", res1.data)
    
    print("Testing payments...")
    res2 = supabase.table("payments").select("*").limit(1).execute()
    print("payments:", res2.data)
    
    print("Testing roasts...")
    res3 = supabase.table("roasts").select("*").limit(1).execute()
    print("roasts:", res3.data)
except Exception as e:
    print("Error:", e)
