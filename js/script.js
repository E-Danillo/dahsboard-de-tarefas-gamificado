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
        const $conquistas = document.querySelector("#conquistas")     

        //Criando e Salvando o id da tarefa, lista de tarefas e o xp do usuário
        let listaDeConquistas = JSON.parse(localStorage.getItem("conquistas") || JSON.stringify(conquistas))
        atualizarConquistas()

        let listaDeTarefas = JSON.parse(localStorage.getItem("tarefas") || "[]")
        let idTarefa = JSON.parse(localStorage.getItem("idTarefa") || "0")  
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
            localStorage.setItem("idTarefa", JSON.stringify(idTarefa))
        }

        function salvarConquistas(){
            localStorage.setItem("conquistas", JSON.stringify(listaDeConquistas))
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

                    if (tarefaEncontrada.concluida === false) {
                        if (tarefaEncontrada.prioridade === "Alta") {
                                xpDoUsuario -= 100
                            } else if ( tarefaEncontrada.prioridade === "Média" ) {
                                xpDoUsuario -= 50
                            } else {
                                xpDoUsuario -= 25
                            }
                    }
                    if (xpDoUsuario < 0) {
                        xpDoUsuario = 0
                    }
                    atualizarConquistas()


                        $xpDoUsuario.textContent = "XP: " + xpDoUsuario 
                        atualizarNivel()
                        salvarXp()
                        atualizarBarraXp()

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

                    // Conquista de desbloquear a primeira tarefa concluída
                    if (listaDeTarefas.filter(t => t.concluida).length === 1) {
                        const conquista = listaDeConquistas[0]

                        if (!conquista.desbloqueada) {  // evita dar XP mais de uma vez
                            conquista.desbloqueada = true
                            xpDoUsuario += conquista.xpGanho  // ← adiciona o XP da conquista
                        }
                    }
                    atualizarConquistas()
                    salvarConquistas()

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

        function atualizarConquistas() {
            $conquistas.innerHTML = "";

            for (let i = 0; i < listaDeConquistas.length; i++) {
                const conquista = listaDeConquistas[i];
                const li = document.createElement("li");
                li.textContent = "🏆 " + conquista.nome;
                li.style.position = "relative"; 
                li.style.listStyle = "none";
                li.style.margin = "20px 0";
                li.style.cursor = "pointer";

            let tooltipText = "";
            if (conquista.desbloqueada) {
                li.style.color = "green";
                tooltipText = conquista.resumo; // mostra resumo real
            } else {
                li.style.color = "#888"; 
                tooltipText = "Complete sua primeira tarefa 🔒"; 
            }

            // Criar tooltip somente se houver texto
            if (tooltipText) {
                const tooltip = document.createElement("span");
                tooltip.textContent = tooltipText;
                tooltip.style.position = "absolute";
                tooltip.style.left = "50%";
                tooltip.style.top = "100%";
                tooltip.style.transform = "translateX(-50%) translateY(8px)";
                tooltip.style.background = "#2d2b55";
                tooltip.style.color = "#fff";
                tooltip.style.padding = "6px 10px";
                tooltip.style.borderRadius = "8px";
                tooltip.style.whiteSpace = "nowrap";
                tooltip.style.opacity = 0;
                tooltip.style.transition = "opacity 0.2s, transform 0.2s";
                tooltip.style.pointerEvents = "none";
                tooltip.style.zIndex = "10";

                li.appendChild(tooltip);

                li.addEventListener("mouseenter", () => {
                    tooltip.style.opacity = 1;
                    tooltip.style.transform = "translateX(-50%) translateY(12px)";
                });
                li.addEventListener("mouseleave", () => {
                    tooltip.style.opacity = 0;
                    tooltip.style.transform = "translateX(-50%) translateY(8px)";
                });
            }

            $conquistas.appendChild(li);
    }
}