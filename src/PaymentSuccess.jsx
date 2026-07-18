import React, { useEffect } from 'react';

// Početak funkcije: PaymentSuccessScreen
const PaymentSuccessScreen = ({ orderDetails }) => {

    // Početak funkcije: triggerGoogleAnalyticsPurchase
    const triggerGoogleAnalyticsPurchase = () => {
        // Proveravamo da li je gtag skripta učitana na sajtu
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "purchase", {
                transaction_id: orderDetails.transactionId, // Dinamički ID iz tvog Security Checkout-a
                value: orderDetails.price, // npr. 1699.99
                currency: "USD",
                items: [
                    {
                        item_id: orderDetails.assetId,
                        item_name: orderDetails.assetName,
                        price: orderDetails.price,
                        quantity: 1
                    }
                ]
            });
            console.log("GA4 Purchase Event Fired!");
        }
    };
    // Kraj funkcije: triggerGoogleAnalyticsPurchase

    // Početak funkcije: useEffect
    useEffect(() => {
        // Pozivamo funkciju za praćenje čim se komponenta učita
        triggerGoogleAnalyticsPurchase();
    }, []); 
    // Kraj funkcije: useEffect

    // Početak funkcije: render
    return (
        <div className="v8-dark-theme-container bg-black text-orange-500">
            <h2>Plaćanje uspešno!</h2>
            <p>Hvala na kupovini. Vaš 150MP paket je spreman za preuzimanje.</p>
            {/* Ovde ide tvoje dugme za Download */}
        </div>
    );
    // Kraj funkcije: render
};
// Kraj funkcije: PaymentSuccessScreen

export default PaymentSuccessScreen;