import { MdOutlineClose } from "react-icons/md";
import { LayoutModalAddTransaction } from "./layoutModalAddTransaction";
import { FormEvent, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConnection";
import toast from "react-hot-toast";

interface modalAddTransactionProps {
    closeModal: () => void;
}

export interface TransactionPros {
    type: string;
    description: string;
    value: string;
    date: string;
    category: string;
    paymentForm: string;
    observation: string;
    userId: string | null | undefined;
}

const now = new Date()
const hour = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
})

export function ModalAddTransaction({ closeModal }: modalAddTransactionProps) {
    const [transaction, setTransaction] = useState<TransactionPros>({
        type: '',
        description: '',
        value: '',
        date: '',
        category: '',
        paymentForm: '',
        observation: '',
        userId: auth.currentUser?.uid,
    })

    async function handleAddTransaction(e: FormEvent) {
        e.preventDefault()

        await addDoc(collection(db, 'transactions'), { ...transaction, hour: hour })
            .then(() => {
                toast.success('Nova transação adicionada com sucesso!')
                closeModal()
            })
            .catch((error) => {
                console.log('Erro ao adicionar transação: ' + error)
            })
    }

    return (
        <div className="bg-black/40 fixed inset-0 flex items-center justify-center z-10">
            <main className="bg-white w-11/12 max-w-xl h-auto flex flex-col rounded-lg p-8 ">
                <header className="border-b border-gray-200">
                    <div className="flex  justify-between mb-2">
                        <p className="font-bold sm:text-lg text-base">Nova Transação</p>
                        <MdOutlineClose onClick={closeModal} size={25} className="cursor-pointer mb-4 text-black transition-all duration-200 hover:text-red-500" />
                    </div>
                </header>

                <form onSubmit={handleAddTransaction} className="mt-4 flex flex-col">
                    <LayoutModalAddTransaction transaction={transaction} setTransaction={setTransaction} />
                    <div className="flex gap-4">
                        <button onClick={closeModal} type="button" className="sm:text-base text-sm border w-full border-gray-200 px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white">
                            Cancelar
                        </button>
                        <button className="sm:text-base text-sm w-full bg-gray-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-gray-800">
                            Salvar
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}