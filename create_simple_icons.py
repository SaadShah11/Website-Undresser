#!/usr/bin/env python3
import os

# Create simple placeholder icon files
def create_placeholder_icons():
    os.makedirs('icons', exist_ok=True)
    
    # Create empty PNG files as placeholders
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        filename = f'icons/icon{size}.png'
        # Create a minimal PNG file (1x1 transparent pixel)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82'
        
        with open(filename, 'wb') as f:
            f.write(png_data)
        
        print(f"Created placeholder {filename}")

if __name__ == "__main__":
    create_placeholder_icons()
    print("Placeholder icons created. Replace with proper icons later.")