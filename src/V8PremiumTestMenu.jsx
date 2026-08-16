// POČETAK FAJLA: V8PremiumTestMenu.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v8Toast } from './v8Utils';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { QrCode, Save, Download, Store, Crown, Image as ImageIcon, Code, ChevronDown, Upload, RefreshCcw, PenTool, CheckCircle, Utensils, Coffee, Pizza } from 'lucide-react';

import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';
import { CATEGORY_LIMITS, IMG_POOL, RAW_DB } from './v8MenuQRCodeData';

// POČETAK FUNKCIJE: generateInitialItems
const generateInitialItems = (isBlank = false) => {
  let idCounter = 1;
  const finalItems = [];
  
  CATEGORY_LIMITS.forEach((c, catIndex) => {
    const catDemo = RAW_DB[c.name] && RAW_DB[c.name].length > 0 ? RAW_DB[c.name] : [["", "", "0.00"]];
    for (let i = 0; i < c.limit; i++) {
      const demoItem = catDemo[i % catDemo.length]; 
      const demoImage = IMG_POOL[(catIndex + i) % IMG_POOL.length]; 
      
      finalItems.push({ 
        id: isBlank ? `custom-${idCounter}` : `demo-${idCounter}`, 
        category: c.name, 
        name: isBlank ? "" : (demoItem[0] || ""), 
        desc: isBlank ? "" : (demoItem[1] || ""), 
        price: isBlank ? "" : (demoItem[2] || "0.00"), 
        img: '', 
        demoImg: isBlank ? "" : demoImage, 
        isSignature: false 
      });
      idCounter++;
    }
  });
  return finalItems;
};
// KRAJ FUNKCIJE: generateInitialItems

// POČETAK FUNKCIJE: getSuggestionsWithImages
const getSuggestionsWithImages = (categoryName, catIndex) => {
  const catDemo = RAW_DB[categoryName] && RAW_DB[categoryName].length > 0 ? RAW_DB[categoryName] : [];
  return catDemo.map((item, idx) => ({
    name: item[0] || "",
    desc: item[1] || "",
    price: item[2] || "0.00",
    demoImg: IMG_POOL[(catIndex + idx) % IMG_POOL.length]
  }));
};
// KRAJ FUNKCIJE: getSuggestionsWithImages

// 🔥 MASSIVE ITALIAN DEMO MENU DATA 🔥
const ITALIAN_MENU_DATA = {
  restaurantName: "Ristorante L'Antica Ricetta",
  themeColor: "#eab308", 
  currency: "€",
  items: [
    // --- APPETIZERS AND ANTIPASTI ---
    { category: "Appetizers & Antipasti", name: "Bruschetta al Pomodoro", price: "12.00", desc: "Toasted bread, San Marzano tomatoes, fresh basil, garlic oil.", img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Bruschetta ai Funghi", price: "14.00", desc: "Wild mushroom mix, thyme, melted fontina cheese on rustic toast.", img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Caprese", price: "16.00", desc: "Buffalo mozzarella, heirloom tomatoes, fresh basil, balsamic glaze.", img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Prosciutto e Melone", price: "18.00", desc: "Sweet Cantaloupe melon wrapped in 24-month aged Prosciutto di Parma.", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Prosciutto di Parma con Burrata", price: "22.00", desc: "Premium Parma ham with creamy Apulian burrata cheese.", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Appetizers & Antipasti", name: "Burrata con Pomodorini", price: "20.00", desc: "Fresh burrata, confit cherry tomatoes, basil pesto.", img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Carpaccio di Manzo", price: "24.00", desc: "Thinly sliced raw beef, arugula, lemon vinaigrette, Parmigiano shavings.", img: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Carpaccio di Tonno", price: "26.00", desc: "Yellowfin tuna carpaccio, citrus dressing, capers, pink peppercorn.", img: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Vitello Tonnato", price: "22.00", desc: "Chilled sliced veal covered with a creamy tuna and caper sauce.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Crostini Toscani", price: "14.00", desc: "Tuscan chicken liver pâté served on warm toasted bread.", img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Olive Ascolane", price: "12.00", desc: "Fried green olives stuffed with seasoned minced meat.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Mozzarella in Carrozza", price: "15.00", desc: "Fried breaded mozzarella sandwich, served piping hot.", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Fiori di Zucca Fritti", price: "16.00", desc: "Crispy fried zucchini blossoms stuffed with ricotta and anchovies.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Melanzane alla Parmigiana", price: "18.00", desc: "Baked layers of eggplant, tomato sauce, mozzarella, and parmesan.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Appetizers & Antipasti", name: "Arancini", price: "14.00", desc: "Crispy saffron rice balls filled with ragù and melted mozzarella.", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80" },

    // --- SOUPS ---
    { category: "Soups & Traditional", name: "Minestrone", price: "14.00", desc: "Classic rich vegetable soup with seasonal greens and beans.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Ribollita", price: "16.00", desc: "Hearty Tuscan bread and vegetable soup with black cabbage.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Pasta e Fagioli", price: "15.00", desc: "Traditional pasta and cannellini bean soup, rosemary infused.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Pasta e Ceci", price: "15.00", desc: "Warm and comforting pasta and chickpea soup, garlic and olive oil.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Zuppa Toscana", price: "18.00", desc: "Spicy Italian sausage, potatoes, kale, and cream broth.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Acquacotta", price: "14.00", desc: "Traditional peasant soup with tomatoes, herbs, and a poached egg.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Stracciatella alla Romana", price: "16.00", desc: "Roman egg drop soup in rich chicken broth with parmesan.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Pappa al Pomodoro", price: "15.00", desc: "Thick Tuscan tomato and bread soup, fresh basil, extra virgin olive oil.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Brodo con Tortellini", price: "18.00", desc: "Meat-stuffed handmade tortellini served in clear capon broth.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Soups & Traditional", name: "Zuppa di Lenticchie", price: "14.00", desc: "Umbrian lentil soup with pancetta and root vegetables.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },

    // --- PASTA ---
    { category: "Pasta", name: "Spaghetti Carbonara", price: "24.00", desc: "Crispy guanciale, Pecorino Romano, organic egg yolk, black pepper.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Pasta", name: "Cacio e Pepe", price: "22.00", desc: "Classic Roman pasta with toasted black pepper and creamy Pecorino DOP.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Amatriciana", price: "24.00", desc: "Rigatoni in rich tomato sauce, crispy guanciale, chili, and Pecorino.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Pasta alla Gricia", price: "23.00", desc: "The white Amatriciana: guanciale, Pecorino Romano, black pepper.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Spaghetti Aglio e Olio", price: "18.00", desc: "Garlic, cold-pressed olive oil, fresh parsley, and a hint of chili.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Pasta al Pesto Genovese", price: "22.00", desc: "Fresh basil pesto, pine nuts, Parmigiano, garlic, olive oil.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Tagliatelle al Ragù Bolognese", price: "26.00", desc: "Hand-rolled tagliatelle, slow-cooked rich beef and veal ragù.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Pasta", name: "Pappardelle al Cinghiale", price: "28.00", desc: "Wide pasta ribbons with slow-braised wild boar ragù, juniper berries.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Lasagne alla Bolognese", price: "25.00", desc: "Baked layers of pasta, béchamel, bolognese sauce, and Parmigiano.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Lasagne al Pesto", price: "24.00", desc: "Vegetarian lasagna with creamy béchamel and Genovese basil pesto.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Penne all’Arrabbiata", price: "18.00", desc: "Penne pasta in a spicy tomato and garlic sauce, fresh parsley.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Pasta alla Norma", price: "22.00", desc: "Sicilian classic with roasted eggplant, tomato, and salted ricotta.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Pasta Puttanesca", price: "23.00", desc: "Tomatoes, olive oil, anchovies, olives, capers, and garlic.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Linguine alle Vongole", price: "28.00", desc: "Linguine with fresh clams, white wine, garlic, and parsley.", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Spaghetti ai Frutti di Mare", price: "32.00", desc: "Mixed seafood (mussels, clams, shrimp, calamari) in light tomato sauce.", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Pasta", name: "Fettuccine al Tartufo", price: "35.00", desc: "Egg fettuccine tossed in a rich butter sauce with shaved black truffle.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Orecchiette con Cime di Rapa", price: "24.00", desc: "Apulian ear-shaped pasta with broccoli rabe, chili, and anchovy crumbs.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Trofie al Pesto", price: "22.00", desc: "Twisted Ligurian pasta, potatoes, green beans, and fresh basil pesto.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Ravioli Ricotta e Spinaci", price: "24.00", desc: "Handmade ravioli filled with fresh ricotta and spinach, sage butter.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Ravioli al Tartufo", price: "34.00", desc: "Truffle-stuffed ravioli in a light parmesan cream sauce.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Tortellini in Brodo", price: "22.00", desc: "Traditional meat tortellini served in a rich capon broth.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Tortellini alla Panna", price: "24.00", desc: "Meat tortellini tossed in a rich and creamy Parmigiano sauce.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Cannelloni", price: "25.00", desc: "Baked tube pasta stuffed with ricotta, spinach, and topped with ragù.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Gnocchi al Pomodoro", price: "20.00", desc: "Soft potato dumplings in a vibrant San Marzano tomato sauce.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Gnocchi al Gorgonzola", price: "24.00", desc: "Potato dumplings in a rich, creamy Gorgonzola dolce sauce, walnuts.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80" },
    { category: "Pasta", name: "Gnocchi alla Sorrentina", price: "25.00", desc: "Baked gnocchi with tomato sauce, melted mozzarella, and fresh basil.", img: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80" },

    // --- PIZZA AND FOCACCIA ---
    { category: "Pizza & Focaccia", name: "Pizza Margherita", price: "16.00", desc: "San Marzano tomatoes, mozzarella di bufala, fresh basil, olive oil.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Pizza & Focaccia", name: "Pizza Marinara", price: "14.00", desc: "San Marzano tomatoes, garlic, oregano, extra virgin olive oil.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Napoletana", price: "18.00", desc: "Tomatoes, mozzarella, anchovies, capers, oregano.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Diavola", price: "19.00", desc: "Tomato sauce, mozzarella, spicy salami, chili oil.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Capricciosa", price: "21.00", desc: "Mozzarella, baked ham, mushrooms, artichokes, and olives.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Quattro Formaggi", price: "22.00", desc: "White pizza with Mozzarella, Gorgonzola, Fontina, and Parmigiano.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Quattro Stagioni", price: "21.00", desc: "Four sections: artichokes, tomatoes, mushrooms, prosciutto.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Prosciutto e Funghi", price: "20.00", desc: "Tomato sauce, mozzarella, baked ham, and fresh mushrooms.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Ortolana", price: "18.00", desc: "Tomato sauce, mozzarella, grilled zucchini, eggplant, bell peppers.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza Bianca", price: "16.00", desc: "Simple white pizza with mozzarella, ricotta, rosemary, and olive oil.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Pizza al Tartufo", price: "28.00", desc: "White pizza, mozzarella, truffle paste, fresh shaved black truffle.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Pizza & Focaccia", name: "Calzone", price: "19.00", desc: "Folded pizza stuffed with ricotta, mozzarella, salami, and black pepper.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Focaccia Genovese", price: "12.00", desc: "Classic soft focaccia with dimples of olive oil and coarse sea salt.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Focaccia Barese", price: "14.00", desc: "Crispy focaccia topped with cherry tomatoes and black olives.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Pizza & Focaccia", name: "Focaccia al Rosmarino", price: "10.00", desc: "Oven-baked focaccia flatbread with fresh rosemary.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },

    // --- RISOTTO ---
    { category: "Risotto & Rice", name: "Risotto alla Milanese", price: "26.00", desc: "Classic creamy carnaroli rice infused with pure Spanish saffron.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Risotto ai Funghi Porcini", price: "28.00", desc: "Rich risotto with wild porcini mushrooms and a touch of white wine.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Risotto & Rice", name: "Risotto al Tartufo", price: "34.00", desc: "Luxurious creamy risotto with butter, Parmigiano, and fresh black truffle.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Risotto ai Frutti di Mare", price: "32.00", desc: "Seafood risotto with calamari, prawns, and mussels in a light broth.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Risotto al Limone", price: "24.00", desc: "Zesty and bright risotto infused with Amalfi lemon zest and butter.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Risotto alla Zucca", price: "24.00", desc: "Sweet roasted pumpkin risotto with a touch of sage and amaretti.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Risotto al Radicchio", price: "26.00", desc: "Slightly bitter Treviso radicchio risotto smoothed with red wine.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Risotto al Gorgonzola", price: "26.00", desc: "Rich and pungent risotto melted with sweet Gorgonzola dolce.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Risi e Bisi", price: "22.00", desc: "Traditional Venetian soupy risotto with fresh spring peas and pancetta.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Arancini Siciliani", price: "16.00", desc: "Golden fried rice balls stuffed with rich meat ragù and peas.", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80" },
    { category: "Risotto & Rice", name: "Supplì", price: "14.00", desc: "Roman fried rice croquettes filled with gooey mozzarella.", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80" },

    // --- MEAT DISHES ---
    { category: "Meat Dishes", name: "Ossobuco alla Milanese", price: "42.00", desc: "Braised veal shank in white wine and herbs, served with gremolata.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Saltimbocca alla Romana", price: "34.00", desc: "Veal scaloppine wrapped in prosciutto and sage, white wine pan sauce.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Cotoletta alla Milanese", price: "38.00", desc: "Bone-in veal chop, breaded and fried in clarified butter.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Pollo alla Cacciatora", price: "28.00", desc: "Hunter-style braised chicken with tomatoes, onions, mushrooms, and wine.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Vitello Tonnato", price: "32.00", desc: "Cold sliced veal roast covered in a creamy tuna-caper sauce.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Brasato al Barolo", price: "45.00", desc: "Slow-braised beef chuck roast in rich Barolo wine and vegetables.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Bistecca alla Fiorentina", price: "110.00", desc: "Thick-cut Chianina T-bone steak, grilled rare over wood embers.", img: "https://images.unsplash.com/photo-1544025162-8353383827d0?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Meat Dishes", name: "Porchetta", price: "26.00", desc: "Slow-roasted savory pork belly, stuffed with wild fennel and garlic.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Polpette al Sugo", price: "24.00", desc: "Traditional Italian meatballs simmered in a rich tomato sauce.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Involtini di Carne", price: "28.00", desc: "Beef rolls stuffed with cheese, pine nuts, and raisins in tomato gravy.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Spezzatino di Manzo", price: "28.00", desc: "Hearty Italian beef stew with potatoes, carrots, and peas.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Abbacchio alla Romana", price: "36.00", desc: "Roman-style roasted suckling lamb with rosemary, garlic, and white wine.", img: "https://images.unsplash.com/photo-1544025162-8353383827d0?auto=format&fit=crop&w=600&q=80" },
    { category: "Meat Dishes", name: "Salsiccia e Peperoni", price: "24.00", desc: "Grilled sweet Italian sausage tossed with roasted bell peppers and onions.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80" },

    // --- FISH AND SEAFOOD ---
    { category: "Fish & Seafood", name: "Branzino al Forno", price: "48.00", desc: "Whole oven-roasted European sea bass with lemon, herbs, and olive oil.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Orata al Forno", price: "45.00", desc: "Oven-baked sea bream with a crust of potatoes, cherry tomatoes, and olives.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Fritto Misto di Mare", price: "32.00", desc: "Crispy fried mix of calamari, shrimp, and small catch of the day.", img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Calamari Fritti", price: "24.00", desc: "Golden fried squid rings served with lemon and garlic aioli.", img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Polpo alla Griglia", price: "36.00", desc: "Tender grilled octopus tentacles, smoked paprika, olive oil.", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Fish & Seafood", name: "Polpo e Patate", price: "28.00", desc: "Warm octopus and potato salad, fresh parsley, lemon dressing.", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Seppie al Nero", price: "32.00", desc: "Cuttlefish stewed slowly in its own rich, dark ink.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Baccalà alla Vicentina", price: "35.00", desc: "Slow-cooked salted cod in milk, onions, and anchovies, served with polenta.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Baccalà Mantecato", price: "24.00", desc: "Creamy whipped salted cod served over crispy grilled polenta.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Zuppa di Pesce", price: "38.00", desc: "Rich and hearty fisherman's stew with mixed daily catch and shellfish.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Cacciucco", price: "42.00", desc: "Famous Livorno seafood stew, garlic bread, rich tomato and wine broth.", img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Impepata di Cozze", price: "22.00", desc: "Fresh mussels steamed in their juices with heavy black pepper.", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Cozze alla Marinara", price: "24.00", desc: "Mussels steamed in a vibrant garlic, tomato, and white wine sauce.", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80" },
    { category: "Fish & Seafood", name: "Gamberi all’Aglio", price: "28.00", desc: "Succulent prawns sautéed in garlic, olive oil, and parsley.", img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80" },

    // --- VEGETABLES AND SIDE DISHES ---
    { category: "Vegetables & Sides", name: "Parmigiana di Melanzane", price: "18.00", desc: "Layers of fried eggplant, tomato sauce, mozzarella, and parmesan.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Caponata Siciliana", price: "16.00", desc: "Sweet and sour Sicilian eggplant relish with capers and pine nuts.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Peperonata", price: "14.00", desc: "Stewed sweet bell peppers, onions, tomatoes, and garlic.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Carciofi alla Romana", price: "18.00", desc: "Roman-style braised artichokes stuffed with mint and garlic.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Carciofi alla Giudia", price: "20.00", desc: "Jewish-Roman style deep-fried whole crispy artichokes.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Verdure Grigliate", price: "14.00", desc: "Platter of seasonal grilled vegetables drizzled with olive oil.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Patate al Rosmarino", price: "10.00", desc: "Oven-roasted potatoes with garlic and fresh rosemary.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Zucchine alla Scapece", price: "12.00", desc: "Neapolitan fried zucchini marinated in vinegar, garlic, and mint.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Fagioli all’Uccelletto", price: "14.00", desc: "Tuscan cannellini beans stewed in tomato sauce and sage.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },
    { category: "Vegetables & Sides", name: "Insalata Panzanella", price: "16.00", desc: "Tuscan bread and tomato salad, cucumbers, red onions, basil vinaigrette.", img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80" },

    // --- SANDWICHES AND STREET FOOD ---
    { category: "Street Food & Panini", name: "Panino con Porchetta", price: "14.00", desc: "Crusty bread filled with warm, herb-roasted pork belly.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Panino Caprese", price: "12.00", desc: "Fresh mozzarella, tomato, basil, and olive oil in a ciabatta roll.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Panino Prosciutto e Mozzarella", price: "14.00", desc: "Parma ham and fresh mozzarella in artisanal focaccia.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Piadina Romagnola", price: "12.00", desc: "Warm Italian flatbread folded with squacquerone cheese and arugula.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Tramezzini", price: "10.00", desc: "Soft crustless Italian sandwiches filled with tuna, egg, or prosciutto.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Lampredotto", price: "15.00", desc: "Classic Florentine tripe sandwich with salsa verde.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Panzerotti", price: "12.00", desc: "Apulian fried dough pockets filled with tomato and melted mozzarella.", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Pizza al Taglio", price: "8.00", desc: "Roman-style pizza by the slice, assorted daily toppings.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Sfincione Siciliano", price: "10.00", desc: "Thick Sicilian pizza slice with tomato, onions, and breadcrumbs.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },
    { category: "Street Food & Panini", name: "Focaccia Ripiena", price: "12.00", desc: "Stuffed focaccia with mortadella, cheese, and roasted veggies.", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80" },

    // --- DESSERTS ---
    { category: "Desserts", name: "Tiramisù", price: "14.00", desc: "Espresso-soaked savoiardi, mascarpone cream, dark cocoa powder.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80", isSignature: true },
    { category: "Desserts", name: "Panna Cotta", price: "12.00", desc: "Silky vanilla cream dessert with wild berry coulis.", img: "https://images.unsplash.com/photo-1590137876181-2a5a7e340308?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Cannoli Siciliani", price: "12.00", desc: "Crisp pastry tubes filled with sweet ricotta and chocolate chips.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Cassata Siciliana", price: "15.00", desc: "Traditional sponge cake moistened with fruit juices and ricotta.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Sfogliatella", price: "10.00", desc: "Neapolitan shell-shaped filled pastry with sweet ricotta.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Babà Napoletano", price: "12.00", desc: "Small yeast cake saturated in a sweet rum syrup.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Zeppole", price: "10.00", desc: "Italian deep-fried dough balls dusted with powdered sugar.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Bomboloni", price: "10.00", desc: "Italian filled doughnuts, stuffed with pastry cream or Nutella.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Crostata", price: "12.00", desc: "Traditional Italian baked tart filled with apricot or cherry jam.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Torta Caprese", price: "14.00", desc: "Flourless chocolate and almond cake from the island of Capri.", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Torta della Nonna", price: "14.00", desc: "Grandmother's cake: pastry crust, lemon custard, pine nuts.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Zabaione", price: "12.00", desc: "Light, whipped dessert made of egg yolks, sugar, and sweet wine.", img: "https://images.unsplash.com/photo-1590137876181-2a5a7e340308?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Semifreddo", price: "14.00", desc: "Semi-frozen dessert, akin to an ice cream cake with nougat.", img: "https://images.unsplash.com/photo-1590137876181-2a5a7e340308?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Affogato", price: "10.00", desc: "Scoop of vanilla gelato drowned in a shot of hot espresso.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Gelato", price: "8.00", desc: "Artisanal Italian ice cream, selection of daily flavors.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Granita Siciliana", price: "9.00", desc: "Semi-frozen dessert made from sugar, water, and fresh lemon.", img: "https://images.unsplash.com/photo-1590137876181-2a5a7e340308?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Amaretti", price: "8.00", desc: "Small, crunchy almond-flavored Italian macaroons.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Cantucci", price: "10.00", desc: "Tuscan almond biscuits, twice-baked, served with Vin Santo.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Panettone", price: "12.00", desc: "Milanese sweet bread loaf with candied fruits and raisins.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Pandoro", price: "12.00", desc: "Traditional Veronese sweet yeast bread, dusted with vanilla sugar.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Torrone", price: "10.00", desc: "Traditional Italian nougat confection with honey and toasted nuts.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
    { category: "Desserts", name: "Ricciarelli", price: "12.00", desc: "Soft, chewy almond cookies from Siena, dusted in icing sugar.", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" }
  ]
};

// POČETAK FUNKCIJE: V8PremiumTestMenu
export default function V8PremiumTestMenu() {
  const [items, setItems] = useState(() => generateInitialItems(false));
  const [restaurantName, setRestaurantName] = useState('AURA Fine Dining');
  const [currency, setCurrency] = useState('€');
  const [themeColor, setThemeColor] = useState('#FF8C00');

  const [customItems, setCustomItems] = useState(() => generateInitialItems(true));
  const [customRestaurantName, setCustomRestaurantName] = useState('');
  const [customCurrency, setCustomCurrency] = useState('€');
  const [customThemeColor, setCustomThemeColor] = useState('#10b981');

  const [isSaving, setIsSaving] = useState(false);
  const [generatedMenuId, setGeneratedMenuId] = useState(null);
  
  // 🟢 NOVA STANJA ZA ITALIJANSKI DEMO
  const [isSavingItalian, setIsSavingItalian] = useState(false);
  const [generatedItalianMenuId, setGeneratedItalianMenuId] = useState(null);
  const [isItalianPreviewOpen, setIsItalianPreviewOpen] = useState(false);
  
  const [uploadingItemId, setUploadingItemId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activeCustomDropdownId, setActiveCustomDropdownId] = useState(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // POČETAK FUNKCIJE: handleClearItem
  const handleClearItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, name: '', desc: '', price: '', img: '', demoImg: '', isSignature: false } : item));
  };
  // KRAJ FUNKCIJE: handleClearItem
  
  // POČETAK FUNKCIJE: handleItemChange
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  // KRAJ FUNKCIJE: handleItemChange
  
  // POČETAK FUNKCIJE: handleSuggestionSelect
  const handleSuggestionSelect = (id, suggestion) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          name: suggestion.name, 
          desc: suggestion.desc,
          price: suggestion.price || item.price,
          demoImg: suggestion.demoImg || item.demoImg 
        };
      }
      return item;
    }));
    setActiveDropdownId(null);
  };
  // KRAJ FUNKCIJE: handleSuggestionSelect
  
  // POČETAK FUNKCIJE: handleImageUpload
  const handleImageUpload = async (id, file) => {
    if (!file) return;
    setUploadingItemId(id);
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      if (resData.secure_url) handleItemChange(id, 'img', resData.secure_url);
    } catch (err) { 
      console.error(err);
    } finally { setUploadingItemId(null); }
  };
  // KRAJ FUNKCIJE: handleImageUpload

  // POČETAK FUNKCIJE: handleCustomClearItem
  const handleCustomClearItem = (id) => {
    setCustomItems(customItems.map(item => item.id === id ? { ...item, name: '', desc: '', price: '', img: '', demoImg: '', isSignature: false } : item));
  };
  // KRAJ FUNKCIJE: handleCustomClearItem
  
  // POČETAK FUNKCIJE: handleCustomItemChange
  const handleCustomItemChange = (id, field, value) => {
    setCustomItems(customItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  // KRAJ FUNKCIJE: handleCustomItemChange
  
  // POČETAK FUNKCIJE: handleCustomSuggestionSelect
  const handleCustomSuggestionSelect = (id, suggestion) => {
    setCustomItems(customItems.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          name: suggestion.name, 
          desc: suggestion.desc,
          price: suggestion.price || item.price,
          demoImg: suggestion.demoImg || item.demoImg 
        };
      }
      return item;
    }));
    setActiveCustomDropdownId(null);
  };
  // KRAJ FUNKCIJE: handleCustomSuggestionSelect
  
  // POČETAK FUNKCIJE: handleCustomImageUpload
  const handleCustomImageUpload = async (id, file) => {
    if (!file) return;
    setUploadingItemId(id);
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      if (resData.secure_url) handleCustomItemChange(id, 'img', resData.secure_url);
    } catch (err) { 
      console.error(err); 
    } finally { setUploadingItemId(null); }
  };
  // KRAJ FUNKCIJE: handleCustomImageUpload

  const activeItems = items.filter(item => item.name && item.name.trim() !== '');

  const groupedItems = activeItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryOrder = CATEGORY_LIMITS.map(c => c.name);
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    let indexA = categoryOrder.indexOf(a);
    let indexB = categoryOrder.indexOf(b);
    if (indexA === -1) indexA = 99;
    if (indexB === -1) indexB = 99;
    return indexA - indexB;
  });

  // 🟢 POČETAK FUNKCIJE: handleGenerateItalianQR
  const handleGenerateItalianQR = async () => {
    setIsSavingItalian(true);
    try {
      const docData = {
        restaurantName: ITALIAN_MENU_DATA.restaurantName,
        currency: ITALIAN_MENU_DATA.currency,
        themeColor: ITALIAN_MENU_DATA.themeColor,
        items: ITALIAN_MENU_DATA.items,
        createdAt: serverTimestamp(),
        status: 'active'
      };

      const savePromise = addDoc(collection(db, 'v8_qr_menus'), docData);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 3000));
      const docRef = await Promise.race([savePromise, timeoutPromise]);
      
      setGeneratedItalianMenuId(docRef.id);
      if(typeof v8Toast !== 'undefined') v8Toast.success("Italian Demo deployed!");
    } catch (error) {
      console.error("Firebase save error / Timeout:", error);
      setGeneratedItalianMenuId("TEST-QR-PREVIEW-123");
      if(typeof v8Toast !== 'undefined') v8Toast.success("Italian Test QR Generated!");
    } finally {
      setIsSavingItalian(false);
    }
  };
  // KRAJ FUNKCIJE: handleGenerateItalianQR

  // POČETAK FUNKCIJE: handleGenerateQR (AURA)
  const handleGenerateQR = async () => {
    if (!restaurantName.trim() || activeItems.length === 0) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Enter a restaurant name and at least one item!");
      return;
    }
    setIsSaving(true);
    
    try {
      const itemsToSave = activeItems.map(item => ({
        id: item.id,
        category: item.category,
        name: item.name,
        desc: item.desc,
        price: item.price,
        img: item.img ? item.img : item.demoImg, 
        isSignature: item.isSignature
      }));
      
      const docData = {
        restaurantName,
        currency,
        themeColor,
        items: itemsToSave, 
        createdAt: serverTimestamp(),
        status: 'active'
      };

      const savePromise = addDoc(collection(db, 'v8_qr_menus'), docData);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 3000));
      
      const docRef = await Promise.race([savePromise, timeoutPromise]);
      
      setGeneratedMenuId(docRef.id);
      if(typeof v8Toast !== 'undefined') v8Toast.success("Database deployed! QR code ready.");
      
    } catch (error) {
      console.error("Firebase save error / Timeout:", error);
      setGeneratedMenuId("TEST-QR-PREVIEW-123");
      if(typeof v8Toast !== 'undefined') v8Toast.success("Test QR Generated Successfully!");
    } finally {
      setIsSaving(false);
    }
  };
  // KRAJ FUNKCIJE: handleGenerateQR

  // AURA URL LOGIKA
  const publicMenuUrl = generatedMenuId ? `https://aitoolsprosmart.com/m/${generatedMenuId}` : '';
  const qrCodeImageUrl = generatedMenuId ? `https://quickchart.io/qr?text=${encodeURIComponent(publicMenuUrl)}&margin=1&size=512` : null;
  
  // ITALIAN URL LOGIKA
  const publicItalianMenuUrl = generatedItalianMenuId ? `https://aitoolsprosmart.com/m/${generatedItalianMenuId}` : '';
  const qrCodeItalianImageUrl = generatedItalianMenuId ? `https://quickchart.io/qr?text=${encodeURIComponent(publicItalianMenuUrl)}&margin=1&size=512` : null;
  
  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="bg-[#24272b] p-6 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.6)] max-w-[1600px] w-[96%] mx-auto mt-28 relative font-sans selection:bg-[#3b82f6] selection:text-white">
      
      {/* 🎬 HERO BANER */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border border-white/10">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 pointer-events-none">
          <source src="/v8-debranding-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505]"></div>
        <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
          <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
            V8 CINEMATIC PROTOCOL // QR RESTAURANT SUITE
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
            <Code className="text-orange-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]" />
            QR <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">MENU BUILDER</span>
          </h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 relative z-10 mb-12 items-start">
        
        {/* ========================================================================= */}
        {/* 🟢 POČETAK: LEVA STRANA (SIVA 3D TEMA + PLAVI TEKST - NETAKNUTO) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-12 w-full">

          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <label className="text-blue-400 font-black text-sm md:text-base tracking-widest uppercase flex items-center gap-3 drop-shadow-md">
                <Store size={22} /> 1. EXPLORE OUR MENU
              </label>
              <button 
                onClick={() => document.getElementById('custom-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-sm font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center gap-2 hover:brightness-125 drop-shadow-md text-blue-400"
              >
                OR CREATE YOUR CUSTOM MENU <ChevronDown size={18} className="animate-bounce" />
              </button>
            </div>

            {/* GLAVNI SIVI KONTEJNER (ISPUPČEN 3D EFEKAT) */}
            <div className="bg-[#2b2e34] border border-[#3e4249] border-t-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col gap-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-full">
              
              {/* TOP GRID (UDUBLJEN 3D EFEKAT) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 bg-[#1f2226] border border-black p-6 rounded-3xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
                
                <div className="md:col-span-6">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">
                    Restaurant Name
                  </label>
                  <input 
                    type="text" 
                    value={restaurantName} 
                    onChange={(e) => setRestaurantName(e.target.value)} 
                    placeholder="e.g., Casa Dragones Lounge" 
                    className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] placeholder:text-blue-900/60" 
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">
                    Currency
                  </label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)} 
                    className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]"
                  >
                    <option value="€">EUR (€)</option>
                    <option value="$">USD ($)</option>
                    <option value="RSD">RSD</option>
                    <option value="£">GBP (£)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">
                    Theme Color
                  </label>
                  <select 
                    value={themeColor} 
                    onChange={(e) => setThemeColor(e.target.value)} 
                    className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]"
                  >
                    <option value="#FF8C00">V8 Orange</option>
                    <option value="#3b82f6">V8 Blue</option>
                    <option value="#10b981">V8 Green</option>
                    <option value="#eab308">V8 Gold</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-10 overflow-y-auto max-h-[750px] pr-3 custom-scrollbar">
                {CATEGORY_LIMITS.map((cat, catIndex) => {
                  const catItems = items.filter(i => i.category === cat.name);
                  const activeCount = catItems.filter(i => i.name.trim() !== '').length;
                  const categorySuggestions = getSuggestionsWithImages(cat.name, catIndex);

                  return (
                    <div key={`demo-${cat.name}`} className="shrink-0 bg-[#30343a] border border-[#434851] border-t-white/10 rounded-3xl p-6 md:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
                      
                      <div className="flex items-center justify-between bg-[#1f2226] p-5 rounded-2xl border border-black shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] mb-8">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-blue-300 font-black uppercase tracking-[0.2em] text-lg md:text-xl flex items-center gap-3 drop-shadow-md">
                            <span 
                              className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                              style={{ backgroundColor: themeColor }}>
                            </span>
                            {cat.name} {cat.name === "House Specials" ? "🔥" : ""}
                          </h3>
                          <span className="text-blue-500/70 text-[11px] uppercase font-bold tracking-[0.3em]">Category Configuration</span>
                        </div>
                        <span className="text-blue-200 font-black text-sm bg-[#16181b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-black px-5 py-3 rounded-lg">
                          {activeCount} / {cat.limit} SLOTS
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {catItems.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="shrink-0 bg-[#383d44] border border-[#4e545c] border-t-white/10 border-l-4 border-l-blue-900/50 rounded-2xl p-6 md:p-8 relative group focus-within:border-l-blue-400 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                          >
                            <div className="flex justify-between items-center mb-6 border-b border-[#4e545c] pb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-blue-400/80 font-black text-xs uppercase tracking-widest">
                                  {item.category} / Slot {index + 1}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 pr-10">
                              <div className="md:col-span-8 relative">
                                <input 
                                  type="text" 
                                  value={item.name} 
                                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} 
                                  onFocus={() => setActiveDropdownId(item.id)} 
                                  onBlur={() => setTimeout(() => setActiveDropdownId(null), 250)} 
                                  placeholder="Choose a dish or type your own..." 
                                  className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 pr-12 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] placeholder:text-blue-900/60" 
                                />
                                <ChevronDown size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/60 pointer-events-none" />
                                
                                <AnimatePresence>
                                  {activeDropdownId === item.id && categorySuggestions.length > 0 && (
                                    <motion.div 
                                      key={`dropdown-demo-${item.id}`} 
                                      initial={{ opacity: 0, y: -5 }} 
                                      animate={{ opacity: 1, y: 0 }} 
                                      exit={{ opacity: 0, y: -5 }} 
                                      className="absolute top-full left-0 w-full mt-2 bg-[#2b2e34] border border-[#3e4249] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] z-[100] max-h-60 overflow-y-auto custom-scrollbar"
                                    >
                                      {categorySuggestions.map((suggestion, sIdx) => (
                                        <div 
                                          key={sIdx} 
                                          onMouseDown={(e) => { 
                                            e.preventDefault(); 
                                            handleSuggestionSelect(item.id, suggestion); 
                                          }} 
                                          className="p-4 border-b border-[#3e4249]/50 hover:bg-[#32363d] cursor-pointer"
                                        >
                                          <div className="text-blue-100 font-bold text-base mb-1">{suggestion.name}</div>
                                          <div className="text-blue-400/60 text-xs line-clamp-2">{suggestion.desc}</div>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="md:col-span-4 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70 text-base font-black">{currency}</span>
                                <input 
                                  type="text" 
                                  value={item.price} 
                                  onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} 
                                  placeholder="0.00" 
                                  className="w-full bg-[#16181b] border border-black rounded-xl pl-10 pr-5 py-4 text-blue-300 text-base md:text-lg font-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] placeholder:text-blue-900/50" 
                                />
                              </div>
                            </div>
                            <div className="mb-6">
                              <textarea 
                                value={item.desc} 
                                onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} 
                                placeholder="Short description, ingredients..." 
                                rows={2} 
                                className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-200 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] resize-none placeholder:text-blue-900/60" 
                              />
                            </div>
                            <div className="border-t border-[#4e545c] pt-6">
                              <label className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-blue-400" /> Dish Image
                              </label>
                              {item.img ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#16181b] group shadow-inner">
                                  <img src={item.img} alt="Uploaded dish" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    id={`file-demo-${item.id}`} 
                                    className="hidden" 
                                    onChange={(e) => { 
                                      if(e.target.files && e.target.files[0]) {
                                        handleImageUpload(item.id, e.target.files[0]); 
                                      }
                                    }} 
                                  />
                                  <label 
                                    htmlFor={`file-demo-${item.id}`} 
                                    className={`flex items-center justify-center gap-3 w-full bg-[#202327] border-2 border-dashed rounded-xl py-6 text-base font-black uppercase cursor-pointer transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] ${uploadingItemId === item.id ? 'border-blue-400 text-blue-400' : 'border-[#4e545c] text-blue-400/70 hover:border-blue-400 hover:text-blue-300'}`}
                                  >
                                    {uploadingItemId === item.id ? (
                                      <><RefreshCcw size={20} className="animate-spin" /> UPLOADING...</>
                                    ) : (
                                      <><Upload size={20} /> UPLOAD IMAGE FROM PC</>
                                    )}
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent my-4"></div>

          {/* BOX 2: CUSTOM MENU */}
          <div id="custom-box" className="flex flex-col gap-6 w-full pt-10 border-t-2 border-[#3e4249] border-dashed">
            <label className="text-blue-400 font-black text-sm md:text-base tracking-widest uppercase flex items-center gap-3 drop-shadow-md">
              <PenTool size={22} /> 2. CREATE YOUR CUSTOM MENU
            </label>

            <div className="bg-[#2b2e34] border border-[#3e4249] border-t-blue-500/30 rounded-[2rem] p-6 md:p-8 flex flex-col gap-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-full">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 bg-[#1f2226] border border-black p-6 rounded-3xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
                <div className="md:col-span-6">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">
                    Your Custom Restaurant Name
                  </label>
                  <input 
                    type="text" 
                    value={customRestaurantName} 
                    onChange={(e) => setCustomRestaurantName(e.target.value)} 
                    placeholder="Enter custom name..." 
                    className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] placeholder:text-blue-900/60" 
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">
                    Currency
                  </label>
                  <select 
                    value={customCurrency} 
                    onChange={(e) => setCustomCurrency(e.target.value)} 
                    className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]"
                  >
                    <option value="€">EUR (€)</option>
                    <option value="$">USD ($)</option>
                    <option value="RSD">RSD</option>
                    <option value="£">GBP (£)</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">
                    Theme Color
                  </label>
                  <select 
                    value={customThemeColor} 
                    onChange={(e) => setCustomThemeColor(e.target.value)} 
                    className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]"
                  >
                    <option value="#FF8C00">V8 Orange</option>
                    <option value="#3b82f6">V8 Blue</option>
                    <option value="#10b981">V8 Green</option>
                    <option value="#eab308">V8 Gold</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-10 overflow-y-auto max-h-[750px] pr-3 custom-scrollbar">
                {CATEGORY_LIMITS.map((cat, catIndex) => {
                  const catItems = customItems.filter(i => i.category === cat.name);
                  const activeCount = catItems.filter(i => i.name.trim() !== '').length;
                  const categorySuggestions = getSuggestionsWithImages(cat.name, catIndex);

                  return (
                    <div key={`custom-${cat.name}`} className="shrink-0 bg-[#30343a] border border-[#434851] border-t-white/10 rounded-3xl p-6 md:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
                      
                      <div className="flex items-center justify-between bg-[#1f2226] p-5 rounded-2xl border border-black shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] mb-8">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-blue-300 font-black uppercase tracking-[0.2em] text-lg md:text-xl flex items-center gap-3 drop-shadow-md">
                            <span 
                              className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                              style={{ backgroundColor: customThemeColor }}>
                            </span>
                            {cat.name} {cat.name === "House Specials" ? "🔥" : ""}
                          </h3>
                          <span className="text-blue-500/70 text-[11px] uppercase font-bold tracking-[0.3em]">Category Configuration</span>
                        </div>
                        <span className="text-blue-200 font-black text-sm bg-[#16181b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-black px-5 py-3 rounded-lg">
                          {activeCount} / {cat.limit} SLOTS
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {catItems.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="shrink-0 bg-[#383d44] border border-[#4e545c] border-t-white/10 border-l-4 border-l-blue-900/50 rounded-2xl p-6 md:p-8 relative group focus-within:border-l-blue-400 transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
                          >
                            <div className="flex justify-between items-center mb-6 border-b border-[#4e545c] pb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-blue-400/80 font-black text-xs uppercase tracking-widest">
                                  {item.category} / Slot {index + 1}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 pr-10">
                              <div className="md:col-span-8 relative">
                                <input 
                                  type="text" 
                                  value={item.name} 
                                  onChange={(e) => handleCustomItemChange(item.id, 'name', e.target.value)} 
                                  onFocus={() => setActiveCustomDropdownId(item.id)} 
                                  onBlur={() => setTimeout(() => setActiveCustomDropdownId(null), 250)} 
                                  placeholder="Type custom dish name..." 
                                  className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 pr-12 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] placeholder:text-blue-900/60" 
                                />
                                <ChevronDown size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/60 pointer-events-none" />
                                
                                <AnimatePresence>
                                  {activeCustomDropdownId === item.id && categorySuggestions.length > 0 && (
                                    <motion.div 
                                      key={`dropdown-custom-${item.id}`} 
                                      initial={{ opacity: 0, y: -5 }} 
                                      animate={{ opacity: 1, y: 0 }} 
                                      exit={{ opacity: 0, y: -5 }} 
                                      className="absolute top-full left-0 w-full mt-2 bg-[#2b2e34] border border-[#3e4249] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] z-[100] max-h-60 overflow-y-auto custom-scrollbar"
                                    >
                                      {categorySuggestions.map((suggestion, sIdx) => (
                                        <div 
                                          key={sIdx} 
                                          onMouseDown={(e) => { 
                                            e.preventDefault(); 
                                            handleCustomSuggestionSelect(item.id, suggestion); 
                                          }} 
                                          className="p-4 border-b border-[#3e4249]/50 hover:bg-[#32363d] cursor-pointer"
                                        >
                                          <div className="text-blue-100 font-bold text-base mb-1">{suggestion.name}</div>
                                          <div className="text-blue-400/60 text-xs line-clamp-2">{suggestion.desc}</div>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="md:col-span-4 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70 text-base font-black">{customCurrency}</span>
                                <input 
                                  type="text" 
                                  value={item.price} 
                                  onChange={(e) => handleCustomItemChange(item.id, 'price', e.target.value)} 
                                  placeholder="0.00" 
                                  className="w-full bg-[#16181b] border border-black rounded-xl pl-10 pr-5 py-4 text-blue-300 text-base md:text-lg font-black outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] placeholder:text-blue-900/50" 
                                />
                              </div>
                            </div>
                            <div className="mb-6">
                              <textarea 
                                value={item.desc} 
                                onChange={(e) => handleCustomItemChange(item.id, 'desc', e.target.value)} 
                                placeholder="Short custom description..." 
                                rows={2} 
                                className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-200 text-base outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] resize-none placeholder:text-blue-900/60" 
                              />
                            </div>
                            <div className="border-t border-[#4e545c] pt-6">
                              <label className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-blue-400" /> Dish Image
                              </label>
                              {item.img ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#16181b] group shadow-inner">
                                  <img src={item.img} alt="Uploaded dish" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    id={`file-custom-${item.id}`} 
                                    className="hidden" 
                                    onChange={(e) => { 
                                      if(e.target.files && e.target.files[0]) {
                                        handleCustomImageUpload(item.id, e.target.files[0]); 
                                      }
                                    }} 
                                  />
                                  <label 
                                    htmlFor={`file-custom-${item.id}`} 
                                    className={`flex items-center justify-center gap-3 w-full bg-[#202327] border-2 border-dashed rounded-xl py-6 text-base font-black uppercase cursor-pointer transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] ${uploadingItemId === item.id ? 'border-blue-400 text-blue-400' : 'border-[#4e545c] text-blue-400/70 hover:border-blue-400 hover:text-blue-300'}`}
                                  >
                                    {uploadingItemId === item.id ? (
                                      <><RefreshCcw size={20} className="animate-spin" /> UPLOADING...</>
                                    ) : (
                                      <><Upload size={20} /> UPLOAD IMAGE FROM PC</>
                                    )}
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {/* ========================================================================= */}
        {/* 🔴 KRAJ: LEVA STRANA */}
        {/* ========================================================================= */}

        {/* ========================================================================= */}
        {/* 🟢 POČETAK: DESNA STRANA (QR GENERATORI I PREVIEW HARMONIKE) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col gap-8 sticky top-[120px] w-full h-max">
          
          {/* ======================= 1. AURA DEMO BLOK ======================= */}
          <div className="bg-gradient-to-b from-[#11151c] to-[#0a0e17] border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative w-full overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {!generatedMenuId ? (
              <div className="w-full relative z-10 flex flex-col items-center">
                <div className="w-full max-w-[220px] mb-6 rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_20px_rgba(255,140,0,0.15)] group-hover:shadow-[0_0_40px_rgba(255,140,0,0.3)] transition-all duration-500">
                  <img src="/QRMenuPromo.webp" alt="QR Menu Promo" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-white font-black text-[14px] uppercase tracking-[0.2em] mb-2">SAVE MENU & DEPLOY</h3>
                <p className="text-zinc-400 text-[11px] mb-8 leading-relaxed max-w-[220px]">Generate a unique, scannable QR code matrix for your client's tables.</p>
                <button 
                  onClick={handleGenerateQR} 
                  disabled={isSaving} 
                  className="w-full text-black font-black text-[13px] uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,140,0,0.3)] hover:shadow-[0_0_30px_rgba(255,140,0,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
                  style={{ background: `linear-gradient(to right, ${themeColor}, ${themeColor}dd)` }}
                >
                  {isSaving ? 'GENERATING...' : <><Save size={18} /> GENERATE QR CODE</>}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full relative z-10">
                <div className="bg-white p-4 rounded-2xl mb-5 shadow-[0_0_40px_rgba(255,140,0,0.2)]">
                  <img src={qrCodeImageUrl} alt="QR Code" className="w-40 h-40 object-contain" />
                </div>
                <div className="flex items-center gap-2 text-emerald-400 mb-5 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black tracking-widest">
                  <CheckCircle size={14} className="animate-pulse" /><span>LIVE QR READY</span>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <a 
                    href={qrCodeImageUrl} 
                    download={`QR_Menu_${restaurantName.replace(/\s+/g, '_')}.png`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full text-black font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{ background: `linear-gradient(to right, ${themeColor}, ${themeColor}dd)` }}
                  >
                    <Download size={16} /> DOWNLOAD
                  </a>
                  <button 
                    onClick={() => setGeneratedMenuId(null)} 
                    className="w-full bg-black/60 border border-white/10 text-zinc-400 hover:text-white px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    RESET
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="w-full bg-[#050505] rounded-[2rem] border border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-500 overflow-hidden">
             <div 
               className="pt-6 pb-5 px-6 cursor-pointer flex justify-between items-center group bg-[#0a0a0a] hover:bg-[#111111] transition-colors z-20 relative border-b border-white/5"
               onClick={() => setIsPreviewOpen(!isPreviewOpen)}
             >
                <h2 className="font-black uppercase tracking-[0.15em] text-base md:text-lg truncate pr-4" style={{ color: themeColor }}>
                   {restaurantName || 'AURA FINE DINING'}
                </h2>
                <div className="bg-black border border-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:border-orange-500/50 transition-colors">
                   <ChevronDown size={18} className={`transition-transform duration-300 ${isPreviewOpen ? 'rotate-180' : ''}`} style={{ color: themeColor }} />
                </div>
             </div>

             <AnimatePresence>
                {isPreviewOpen && (
                   <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                   >
                      <div className="px-5 py-6 flex flex-col gap-8 bg-[#050505] max-h-[50vh] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                         {sortedCategories.length === 0 ? (
                            <div className="text-center text-zinc-600 text-[11px] font-black uppercase mt-4 mb-4">NO ITEMS TO DISPLAY</div>
                         ) : (
                            sortedCategories.map(category => (
                               <div key={category} className="flex flex-col gap-4">
                                  <div className="border-b border-white/10 pb-2">
                                     <h3 className="text-white font-black text-xs uppercase tracking-widest">{category}</h3>
                                  </div>
                                  <div className="flex flex-col gap-4">
                                     {groupedItems[category].map((item, idx) => {
                                        const displayImg = item.img || item.demoImg;
                                        return (
                                           <div key={idx} className="bg-[#0a0e17] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col gap-2">
                                              {displayImg && (
                                                 <div className="w-full h-32 lg:h-40 mb-2 rounded-xl overflow-hidden relative shadow-lg">
                                                    <img src={displayImg} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                                 </div>
                                              )}
                                              <div className="flex justify-between items-start gap-3">
                                                 <h4 className="text-white font-black text-[13px] uppercase leading-tight flex items-start gap-1.5">
                                                    {item.category === "House Specials" && <span className="text-[10px] mt-0.5" style={{ color: themeColor }}>★</span>}
                                                    {item.name || 'Item Name'}
                                                 </h4>
                                                 <span className="font-black text-[13px] shrink-0" style={{ color: themeColor }}>
                                                    {currency} {item.price || '0.00'}
                                                 </span>
                                              </div>
                                              <p className="text-zinc-400 text-[10px] leading-relaxed mt-1">{item.desc}</p>
                                           </div>
                                        );
                                     })}
                                  </div>
                               </div>
                            ))
                         )}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* RAZDVAJAČ IZMEĐU DEMOA */}
          <div className="flex items-center gap-4 my-2 opacity-30">
             <div className="flex-1 h-px bg-white"></div>
             <Crown size={14} className="text-white" />
             <div className="flex-1 h-px bg-white"></div>
          </div>

          {/* ======================= 2. ITALIAN DEMO BLOK ======================= */}
          <div className="bg-gradient-to-b from-[#11151c] to-[#0a0e17] border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative w-full overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {!generatedItalianMenuId ? (
              <div className="w-full relative z-10 flex flex-col items-center">
                
                {/* 🟢 SLIKA BARKODA ZA ITALIJANSKI DEMO 🟢 */}
                <div className="w-full max-w-[220px] mb-6 rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_20px_rgba(234,179,8,0.15)] group-hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all duration-500">
                  <img src="/QRMenuPromo.webp" alt="Italian QR Menu Promo" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                
                <h3 className="text-white font-black text-[14px] uppercase tracking-[0.2em] mb-2 text-yellow-500">ITALIAN MENU DEMO</h3>
                <p className="text-zinc-400 text-[11px] mb-8 leading-relaxed max-w-[220px]">Generate a showcase QR code for the Italian restaurant example.</p>
                <button 
                  onClick={handleGenerateItalianQR} 
                  disabled={isSavingItalian} 
                  className="w-full text-black font-black text-[13px] uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer hover:scale-[1.02] bg-gradient-to-r from-yellow-500 to-yellow-600"
                >
                  {isSavingItalian ? 'GENERATING...' : <><Save size={18} /> DEPLOY ITALIAN DEMO</>}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full relative z-10">
                <div className="bg-white p-4 rounded-2xl mb-5 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
                  <img src={qrCodeItalianImageUrl} alt="Italian QR Code" className="w-40 h-40 object-contain" />
                </div>
                <div className="flex items-center gap-2 text-emerald-400 mb-5 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black tracking-widest">
                  <CheckCircle size={14} className="animate-pulse" /><span>ITALIAN QR READY</span>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <a 
                    href={qrCodeItalianImageUrl} 
                    download="Italian_Demo_Menu_QR.png" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full text-black font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-r from-yellow-500 to-yellow-600"
                  >
                    <Download size={16} /> DOWNLOAD
                  </a>
                  <button 
                    onClick={() => setGeneratedItalianMenuId(null)} 
                    className="w-full bg-black/60 border border-white/10 text-zinc-400 hover:text-white px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    RESET
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="w-full bg-[#050505] rounded-[2rem] border border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-500 overflow-hidden">
             <div 
               className="pt-6 pb-5 px-6 cursor-pointer flex justify-between items-center group bg-[#0a0a0a] hover:bg-[#111111] transition-colors z-20 relative border-b border-white/5"
               onClick={() => setIsItalianPreviewOpen(!isItalianPreviewOpen)}
             >
                <h2 className="font-black uppercase tracking-[0.15em] text-base md:text-lg truncate pr-4 text-yellow-500">
                   {ITALIAN_MENU_DATA.restaurantName}
                </h2>
                <div className="bg-black border border-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:border-yellow-500/50 transition-colors">
                   <ChevronDown size={18} className={`transition-transform duration-300 text-yellow-500 ${isItalianPreviewOpen ? 'rotate-180' : ''}`} />
                </div>
             </div>

             <AnimatePresence>
                {isItalianPreviewOpen && (
                   <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                   >
                      <div className="px-5 py-6 flex flex-col gap-8 bg-[#050505] max-h-[50vh] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                         {Object.entries(ITALIAN_MENU_DATA.items.reduce((acc, item) => {
                            if (!acc[item.category]) acc[item.category] = [];
                            acc[item.category].push(item);
                            return acc;
                         }, {})).map(([category, items]) => (
                            <div key={category} className="flex flex-col gap-4">
                               <div className="border-b border-white/10 pb-2">
                                  <h3 className="text-white font-black text-xs uppercase tracking-widest">{category}</h3>
                               </div>
                               <div className="flex flex-col gap-4">
                                  {items.map((item, idx) => (
                                     <div key={idx} className="bg-[#0a0e17] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col gap-2">
                                        <div className="w-full h-32 lg:h-40 mb-2 rounded-xl overflow-hidden relative shadow-lg bg-zinc-900">
                                           <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        </div>
                                        <div className="flex justify-between items-start gap-3">
                                           <h4 className="text-white font-black text-[13px] uppercase leading-tight flex items-start gap-1.5">
                                              {item.isSignature && <span className="text-[10px] mt-0.5 text-yellow-500">★</span>}
                                              {item.name}
                                           </h4>
                                           <span className="font-black text-[13px] shrink-0 text-yellow-500">
                                              {ITALIAN_MENU_DATA.currency} {item.price}
                                           </span>
                                        </div>
                                        <p className="text-zinc-400 text-[10px] leading-relaxed mt-1">{item.desc}</p>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         ))}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
          
        </div>
        {/* ========================================================================= */}
        {/* 🔴 KRAJ: DESNA STRANA */}
        {/* ========================================================================= */}

      </div>
    </div>
  );
}
// KRAJ FUNKCIJE: V8PremiumTestMenu
// KRAJ FAJLA: V8PremiumTestMenu.jsx