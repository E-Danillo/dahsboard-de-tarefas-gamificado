function atualizarBarraXp() {
            let { nivel, xpAcumulado } = calcularNivel(xpDoUsuario)
            let xpNecessario = 200 * Math.pow(1.5, nivel - 1)
            let xpNoNivelAtual = xpDoUsuario - xpAcumulado
            let porcentagem = (xpNoNivelAtual / xpNecessario) * 100
            $barraDeXp.style.width = porcentagem + "%"
        }

        function calcularNivel(xp) {
            let nivel = 1
            let xpAcumulado = 0
            while (true) {
                let xpNecessario = 200 * Math.pow(1.5, nivel - 1)
                if (xp < xpAcumulado + xpNecessario) break
                xpAcumulado += xpNecessario
                nivel++
            }
            return { nivel, xpAcumulado }
        }

        function atualizarNivel() {
            let { nivel } = calcularNivel(xpDoUsuario)
            $nivelDoUsuario.textContent = "⭐ Nível: " + nivel
        }