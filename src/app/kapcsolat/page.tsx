import { ContactForm } from "@/app/components/contact/ContactForm";
import { Container } from "@/app/components/ui/container";

export default function Kapcsolat() {
    return (
        <Container>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Kapcsolat</h1>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Elérhetőségeink</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="font-medium">Email</h3>
                                <p className="text-muted-foreground">info@skillhill.hu</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">Telefon</h3>
                                <p className="text-muted-foreground">+36 1 234 5678</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">Cím</h3>
                                <p className="text-muted-foreground">Budapest, Magyarország</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">Nyitvatartás</h3>
                                <p className="text-muted-foreground">Hétfő - Péntek: 9:00 - 17:00</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Küldj üzenetet</h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </Container>
    );
} 