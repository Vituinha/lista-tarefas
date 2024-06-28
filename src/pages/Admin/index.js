import './admin.css'
import { useState, useEffect } from 'react'

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import { 
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
 } from 'firebase/firestore'

function Admin(){
    const [tarefaInput, setTarefaInput] = useState('')
    const [user, setUser] = useState('')
    const [tarefas, setTarefas] = useState([])
    const [edit, setEdit] = useState([])

    async function handleRegister(e){
        e.preventDefault()

        if(tarefaInput === '')
        {
            alert("Digite uma tarefa...")
            return
        }

        if(edit?.id){
            handleUpdateTarefa()
            return
        }

        const refDocument = collection(db, "tarefas")
        await addDoc(refDocument, {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
        .then(() => {
            console.log("TAREFA REGISTRADA")
            setTarefaInput('')
        })
        .catch((error) => {
            alert("Erro ao registrar " + error)
        })
    }

    async function deleteTarefa(id){
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
    }

    async function editTarefa(item){
        setTarefaInput(item.tarefa)
        setEdit(item)
    }

    async function handleUpdateTarefa(){
        const docRef = doc(db, "tarefas", edit?.id)
        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
        .then(() => {
            console.log("TAREFA ATUALIZADA")
            setTarefaInput('')
            setEdit({})
        })
        .catch((error) => {
            alert("ERRO AO EDITAR " + error)
            setTarefaInput('')
            setEdit({})
        })
    }

    useEffect(() => {
        async function loadTarefas(){
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            if(userDetail)
            {
                const data = JSON.parse(userDetail)

                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data.uid))
                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = []

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })
                    setTarefas(lista)
                })
            }
        }
        loadTarefas()
    }, [])

    async function handleLogout(){
        await signOut(auth)
    }
    return(
        <div className="admin-container">
            <h1>Minhas tarefas</h1>

            <form onSubmit={handleRegister} className='form'>
                <textarea
                placeholder="Digite sua tarefa..."
                value={tarefaInput}
                onChange={(e) => setTarefaInput(e.target.value)}
                />

                {Object.keys(edit).length > 0 ? (
                    <button type='submit' style={{ backgroundColor: '#6add39' }} className='btn-register'>Atualizar tarefa</button>
                ) : (
                    <button type='submit' className='btn-register'>Registrar tarefa</button>
                )}
            </form>

            {tarefas.map((item) =>(
                <article key={item.id} className='list'>
                    <p>{item.tarefa}</p>
                    <div>
                        <button onClick={() => editTarefa(item)}>Editar</button>
                        <button onClick={() => deleteTarefa(item.id)} className='btn-delete'>Concluir</button>
                    </div>
                </article>
            ))}

            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}

export default Admin