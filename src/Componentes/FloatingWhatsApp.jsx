"use client";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { publicContact } from "@/lib/publicContact";

export default function WhatsAppButton() {
    if (!publicContact.whatsappNumber) return null;

    return (
        <FloatingWhatsApp
            phoneNumber={publicContact.whatsappNumber}
            accountName={publicContact.companyName}
            avatar="/logodifort.png" // opcional: logo o imagen en public/
            statusMessage=""
            chatMessage={`Hola, gracias por contactar a ${publicContact.companyName}. ¿En que podemos ayudarte?`}
            placeholder="Escribe tu mensaje..."
            notification
            notificationSound
        />
    );
}
