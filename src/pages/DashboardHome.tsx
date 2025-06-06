import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useUser } from "@/context/userContextProvider"
import { usePDF } from "@/context/pdfContextProvider"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { setGlobalSpaceName } = usePDF();
    const [spaceName, setSpaceName] = useState("")
    const createNewSpace = () => {
        setGlobalSpaceName(spaceName);
        navigate("/dashboard/space");
    }

    return (
        <div className="h-screen w-full">
            <header className="">
                <div className="flex justify-end px-3 py-3 w-full border-b-2">
                    <Dialog>
                        {/* <DialogTrigger disabled={user?.spacesUsed && user.spacesUsed >= 6 || false}>
                            <Button className="bg-blue-600 hover:bg-blue-700 rounded text-white" disabled={user?.spacesUsed && user.spacesUsed >= 6 || false}><Plus />New Space</Button>
                        </DialogTrigger> */}
                        <DialogTrigger>
                            <Button className="bg-blue-600 hover:bg-blue-700 rounded text-white"><Plus />New Space</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Enter the space name</DialogTitle>
                                <DialogDescription>
                                    <p>This name will be used to identify your learning space. Please choose a unique name that reflects the content you plan to study.</p>
                                    <Input type="text" placeholder="space name" className="mt-3" required onChange={(e) => { setSpaceName(e.target.value) }} />
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogTrigger {...spaceName.length > 0 ? {} : { disabled: true }}>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={createNewSpace} {...spaceName.length > 0 ? {} : { disabled: true }}>Create Space</Button>
                                </DialogTrigger>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </header >
            <div className="mx-5">
                <div className="py-5 border-b-1">
                    <h2 className="text-3xl font-semibold">Spaces</h2>
                    <p className="text-md mt-4">Welcome to your personal learning dashboard! As a free tier user, you can create up to 3 learning spaces to organize your study materials.</p>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Created Spaces {user?.spacesUsed ? user.spacesUsed / 2 : 0} / 3</h2>
                </div>
            </div>
        </div >
    )
}
