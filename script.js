        //Variáveis do HTML no Javascript
        const $input = document.querySelector("#input")
        const $adicionar = document.querySelector("#adicionar")
        const $listaDeTarefas = document.querySelector("#lista_de_tarefas") 
        const $xpDoUsuario = document.querySelector("#xp_do_usuario")
        const $nivelDoUsuario = document.querySelector("#nivel_do_usuario")
        const $barraDeXp = document.querySelector("#barra_xp")
        const $criarNovaTarefa = document.querySelector("#criar_nova_tarefa")
        const $divDoFormulario = document.querySelector(".div_do_formulario")
        const $prioridade = document.querySelector("#prioridades")
        const $cancelar = document.querySelector("#cancelar")     

        //Criando e Salvando o id da tarefa, lista de tarefas e o xp do usuário
        let idTarefa = 0
        idTarefa = JSON.parse(localStorage.getItem("tarefas") || "0")
        
        let listaDeTarefas = []
        listaDeTarefas = JSON.parse(localStorage.getItem("tarefas") || "[]")
        idTarefa = listaDeTarefas.length
        atualizarLista()

        let xpDoUsuario = JSON.parse(localStorage.getItem("xp") || "0")
        $xpDoUsuario.textContent = "XP: " + xpDoUsuario
        atualizarNivel()
        atualizarBarraXp()
        
        $criarNovaTarefa.addEventListener("click", () => {
            $divDoFormulario.classList.add("ativada")
        })

        //Escutador do botão adicionar
        $adicionar.addEventListener("click", () => { 
            if ($input.value.trim() === "") {
                return
            }
            listaDeTarefas.push({ id: idTarefa++, texto: $input.value, concluida: false, prioridade: $prioridade.value }) 
            atualizarLista()
            salvarLista()
            $input.value = ""
            $prioridade.value = "Alta"
            $divDoFormulario.classList.remove("ativada")
            }) 

            //Se apertar Enter, envia tarefa também
            $input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                $adicionar.click(); 
            }
        })

        //Escutador do botão cancelar
        $cancelar.addEventListener("click", () => {
            $divDoFormulario.classList.remove("ativada")
        })
        
        //FUNCÕES
        function salvarLista(){
            localStorage.setItem("tarefas", JSON.stringify(listaDeTarefas))
        }

        function salvarXp(){
            localStorage.setItem("xp", JSON.stringify(xpDoUsuario))
        }

        function atualizarLista(){
            $listaDeTarefas.innerHTML = "" // limpa HTML antes

            const pesos = {
                Alta: 3,
                Média: 2,
                Baixa: 1
            }
            listaDeTarefas.sort((a,b) => {
                let pesoA = pesos[a.prioridade] 
                let pesoB = pesos[b.prioridade]   
                return pesoB - pesoA
            })


            for (let i = 0; i < listaDeTarefas.length; i++) {
                const tarefa = listaDeTarefas[i]

                const $tarefa = document.createElement("li")
                $tarefa.dataset.id = tarefa.id

                const $textoSpan = document.createElement("span")

                if (tarefa.prioridade === "Alta") {
                    $textoSpan.textContent = "🔴 " + tarefa.texto
                } else if (tarefa.prioridade === "Média") {
                    $textoSpan.textContent = "🟠 " + tarefa.texto
                } else {
                    $textoSpan.textContent = "🟡 " + tarefa.texto
                }

                const $editar = document.createElement("button")
                $editar.textContent = "Editar"

                const $excluir = document.createElement("button")
                $excluir.textContent = "❌"

                const $concluir = document.createElement("button")
                $concluir.textContent = "✅"

                $tarefa.appendChild($textoSpan)
                $tarefa.appendChild($editar)
                $tarefa.appendChild($excluir)
                $tarefa.appendChild($concluir)
                $listaDeTarefas.appendChild($tarefa)

                // cria o botão de editar-salvar e suas lógicas
                $editar.addEventListener("click", (event) => {
                    const li = event.target.parentElement
                    const id = Number(li.dataset.id)
                    const tarefaEncontrada = listaDeTarefas.find(t => t.id === id)

                    const $inputEdicao = document.createElement("input")
                    $inputEdicao.value = tarefaEncontrada.texto

                    const $salvar = document.createElement("button")
                    $salvar.textContent = "Salvar"

                    li.innerHTML = ""
                    li.appendChild($inputEdicao)
                    li.appendChild($salvar)

                    $salvar.addEventListener("click", () => {
                        if ($inputEdicao.value.trim() !== "") {
                            tarefaEncontrada.texto = $inputEdicao.value
                            atualizarLista() 
                            salvarLista()
                        }
                    })
                })

                // cria o botão de excluir e sua lógica
                $excluir.addEventListener("click", (event) => {
                    const li = event.target.parentElement
                    const id = Number(li.dataset.id)
                    const tarefaEncontrada = listaDeTarefas.find(t => t.id === id)

                    listaDeTarefas = listaDeTarefas.filter(t => t.id !== id)

                    atualizarLista()
                    salvarLista()
                })

                // cria o botão de concluir e sua lógica
                $concluir.addEventListener("click", (event) => {
                    const li = event.target.parentElement
                    const id = Number(li.dataset.id)
                    const tarefaEncontrada = listaDeTarefas.find(t => t.id === id)

                    // já está concluída?
                    if (tarefaEncontrada.concluida) {
                        return
                    }

                    // não está?
                    tarefaEncontrada.concluida = true

                    if (tarefaEncontrada.concluida === true) {
                        if (tarefaEncontrada.prioridade === "Alta") {
                            xpDoUsuario += 100
                        } else if ( tarefaEncontrada.prioridade === "Média" ) {
                            xpDoUsuario += 50
                        } else {
                            xpDoUsuario += 25
                        }
                        
                        $xpDoUsuario.textContent = "XP: " + xpDoUsuario 
                        atualizarNivel()
                        salvarXp()
                        atualizarBarraXp()
                    }

                    atualizarLista();
                    salvarLista()
                })

                if (tarefa.concluida) {
                    $textoSpan.style.textDecoration = "line-through";
                    $textoSpan.style.opacity = "0.6"; 
                } else {
                    $textoSpan.style.textDecoration = "none";
                    $textoSpan.style.opacity = "1";
                }
            }
        }