import json 
import random
 # Define categories and sample data 
categories = { 
    "Groceries": ["Rice", "Wheat Flour", "Cooking Oil", "Sugar", "Salt"], 
    "Snacks": ["Chips", "Cookies", "Chocolate", "Popcorn", "Nuts"], 
    "Beverages": ["Water Bottles", "Juice", "Soft Drinks", "Coffee", "Tea"],
     "Household Items": ["Detergent", "Dish Soap", "Toilet Paper", "Cleaning Spray", "Trash Bags"], 
     "Personal Care": ["Shampoo", "Toothpaste", "Soap", "Lotion", "Deodorant"], 
     "Electronics": ["USB Cable", "Phone Charger", "Power Bank", "Earphones", "Smart Plug"], 
     "Stationery": ["Notebooks", "Pens", "Markers", "Stapler", "Sticky Notes"], 
     "Fruits & Vegetables": ["Apples", "Bananas", "Tomatoes", "Potatoes", "Onions"], 
     "Clothing": ["T-Shirts", "Jeans", "Jackets", "Shoes", "Socks"], 
     "Kitchen Items": ["Frying Pan", "Knife Set", "Cutting Board", "Mixing Bowls", "Measuring Cups"] 
     } 
brands = ["BrandA", "BrandB", "BrandC", "BrandD", "BrandE"] 
colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"] 
materials = ["Plastic", "Metal", "Wood", "Glass", "Ceramic"] 
image_urls = [ 
    "https://via.placeholder.com/150", # Placeholder image 
"https://via.placeholder.com/200", 
"https://via.placeholder.com/250" ] 
# Generate random realistic products 
products = [] 
for _ in range(10000): 
category = random.choice(list(categories.keys())) 
name = random.choice(categories[category]) 
price = round(random.uniform(10, 5000), 2) # Price between 10 and 5000 
discount_percentage = random.randint(5, 50) # Discount between 5% and 50% 
discounted_price = round(price * (1 - discount_percentage / 100), 2) 
rating = round(random.uniform(1, 5), 1) # Rating between 1.0 and 5.0 
sold = random.randint(0, 10000) # Random sold count 
is_available = random.choice([True, False]) 
weight = round(random.uniform(0.1, 10), 2) # Weight in kg 
dimensions = f"{random.randint(10, 50)}x{random.randint(10, 50)}x{random.randint(10, 50)} cm" 
color = random.choice(colors) 
material = random.choice(materials)
natural = random.choice([True, False]) if category in ["Groceries", "Fruits & Vegetables"] else None 
keywords = [name.lower(), category.lower(), random.choice(brands).lower()] 
description = f"{name} from {random.choice(brands)}. High quality and {random.choice(['durable', 'eco-friendly', 'popular', 'affordable'])}." 
product_images = random.sample(image_urls, k=3) # Randomly assign 3 images 
products.append({ 
    "name": name, 
    "category": category, 
    "description": description, 
    "related_keywords": keywords, 
    "price": price, 
    "discounted_price": discounted_price, 
    "discount_percentage": discount_percentage, 
    "is_available": is_available, 
    "product_images": product_images, 
    "rating": rating, 
    "sold": sold, 
    "brand": random.choice(brands), 
    "dimensions": dimensions, 
    "weight": weight, 
    "color": color, 
    "material": material, 
    "natural": natural 
    }) 
    
# Save to a JSON file 
output_file = "/mnt/data/realistic_ecommerce_data.json" 
with open(output_file, "w") as file: 
json.dump(products, file, indent=4) 
output_file  