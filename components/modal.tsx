'use client'

import { Pagar } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

type Props = {
    formData: FormData;
    onClose: () => void;
}

export default function Modal({onClose, formData} : Props) {
    const router = useRouter()

    const clickOk = () => {
        Pagar(formData);
        router.refresh();
        onClose();
    }

    
    return (
        <div className="fixed top-10 left-10 z-10 w-40 h-40 backdrop:bg-gray-800/50">
            <p>Hi</p>
        </div>
    )
}