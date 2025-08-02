import { PrismaClient, Source } from "@prisma/client";  // Import enum Source
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@inventory.com" },
    update: {},
    create: {
      email: "admin@inventory.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@inventory.com" },
    update: {},
    create: {
      email: "user@inventory.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });

  // Create categories
  const categories = [
    "Electronics",
    "Furniture",
    "Office Supplies",
    "Food & Beverage",
    "Clothing",
    "Books",
    "Tools",
    "Medical Supplies",
  ];

  const createdCategories = [];
  for (const categoryName of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
        createdBy: admin.id,
      },
    });
    createdCategories.push(category);
  }

  // Create sample inventory items
  const sampleItems = [
    {
      itemName: "MacBook Pro 16-inch",
      brand: "Apple",
      categoryId: createdCategories[0].id, // Electronics
      source: Source.PURCHASE,  // Use enum value, not string
      quantity: 5,
      description: "Latest MacBook Pro with M3 chip",
      unitPrice: 2499.99,
      lastModifiedBy: admin.id,
    },
    {
      itemName: "Office Chair",
      brand: "Herman Miller",
      categoryId: createdCategories[1].id, // Furniture
      source: Source.PURCHASE,  // Use enum value, not string
      quantity: 12,
      description: "Ergonomic office chair",
      unitPrice: 899.99,
      lastModifiedBy: admin.id,
    },
    {
      itemName: "Wireless Mouse",
      brand: "Logitech",
      categoryId: createdCategories[0].id, // Electronics
      source: Source.PURCHASE,  // Use enum value, not string
      quantity: 25,
      description: "Wireless optical mouse",
      unitPrice: 29.99,
      lastModifiedBy: user.id,
    },
    {
      itemName: "Coffee Beans",
      brand: "Blue Bottle",
      categoryId: createdCategories[3].id, // Food & Beverage
      source: Source.PURCHASE,  // Use enum value, not string
      quantity: 8,
      description: "Premium arabica coffee beans",
      expiryDate: new Date("2024-12-31"),
      unitPrice: 18.99,
      lastModifiedBy: user.id,
    },
    {
      itemName: "Protein Powder",
      brand: "Optimum Nutrition",
      categoryId: createdCategories[7].id, // Medical Supplies
      source: Source.DONATION,  // Use enum value, not string
      quantity: 3,
      description: "Whey protein powder, vanilla flavor",
      expiryDate: new Date("2024-06-30"),
      unitPrice: 45.99,
      lastModifiedBy: admin.id,
    },
  ];

  // Insert sample inventory items
  for (const item of sampleItems) {
    await prisma.inventoryItem.create({
      data: item,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
