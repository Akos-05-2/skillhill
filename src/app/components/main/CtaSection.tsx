'use client';

import { LoginDialog } from "../LoginDialog";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CtaSection(){
    const { data: session } = useSession();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return(
        <section className="bg-primary/5 py-8 md:py-12 lg:py-16 xl:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center px-4 md:px-6">
            <h2 className="mb-3 md:mb-4 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
              Kezdd el a tanulást még ma!
            </h2>
            <p className="mx-auto mb-6 md:mb-8 max-w-xl text-sm md:text-base lg:text-lg text-muted-foreground">
              Csatlakozz több mint 1000 elégedett tanulónkhoz és kezdd el építeni a jövőd
            </p>
            {!session && (
              <LoginDialog 
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLoginSuccess={() => setIsLoginOpen(false)}
                trigger={
                  <button onClick={() => setIsLoginOpen(true)} className="inline-flex h-9 md:h-10 lg:h-11 items-center justify-center rounded-md bg-primary px-3 md:px-4 lg:px-8 text-xs md:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Bejelentkezés
                  </button>
                }
              />
            )}
          </div>
        </div>
      </section>
    )
}
