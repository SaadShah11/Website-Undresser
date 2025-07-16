#!/usr/bin/env python3
"""
Simple script to create PNG icons for the Chrome extension
"""

from PIL import Image, ImageDraw
import os

def create_icon(size, filename):
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Define colors
    bg_color = (102, 126, 234)  # Blue gradient start
    accent_color = (118, 75, 162)  # Purple gradient end
    white = (255, 255, 255)
    
    # Draw background circle
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], fill=bg_color)
    
    # Draw network/connection icon
    center = size // 2
    
    # Draw main node (center)
    node_size = size // 8
    draw.ellipse([center-node_size//2, center-node_size//2, 
                  center+node_size//2, center+node_size//2], fill=white)
    
    # Draw connected nodes
    outer_radius = size // 3
    node_positions = [
        (center + outer_radius//2, center - outer_radius//2),  # Top right
        (center + outer_radius//2, center + outer_radius//2),  # Bottom right
        (center - outer_radius//2, center + outer_radius//2),  # Bottom left
        (center - outer_radius//2, center - outer_radius//2),  # Top left
    ]
    
    small_node = size // 12
    for pos in node_positions:
        # Draw connection line
        draw.line([center, center, pos[0], pos[1]], fill=white, width=max(1, size//32))
        # Draw outer node
        draw.ellipse([pos[0]-small_node//2, pos[1]-small_node//2,
                      pos[0]+small_node//2, pos[1]+small_node//2], fill=white)
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)
    
    # Create icons in different sizes
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        filename = f'icons/icon{size}.png'
        create_icon(size, filename)
    
    print("All icons created successfully!")

if __name__ == "__main__":
    main()