import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/config";
import { Separator } from "@radix-ui/react-separator";

type Item = {
    id: string;
    displayName?: string;
    email?: string;
    createdAt?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
};

export default function Dashboard() {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const colRef = collection(db, 'users');

            try {
                const res = await getDocs(colRef);
                console.log("Fetched items:", res.docs);
                const fetchedItems = res.docs.map(doc => ({
                    id: doc.id,
                    displayName: doc.data().name,
                    email: doc.data().email,
                    createdAt: doc.data().createdAt,
                    ...doc.data(),
                })) as Item[];
                setItems(fetchedItems);
                console.log("Items set:", fetchedItems);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                        </div>
                    </header>
                </SidebarInset>

                <div>
                    <div>
                        {items.map(item => (
                            <div key={item.id}>
                                <p>{item.id}</p>
                                <p>{item.displayName}</p>
                                <p>{item.email}</p>
                                <p>{item.createdAt}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SidebarProvider>
        </>
    )
}
