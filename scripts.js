
const nome = document.querySelector(".nome");
const personagem = document.querySelector(".personagem");

function escolherPersonagem(nomePersonagem, imagemPersonagem, cor) {
    nome.textContent = nomePersonagem;
    personagem.src = imagemPersonagem;
    nome.style.color = cor;
}

async function lerfoto(input) {
    const foto = input.files?.[0];

    if (!foto) return;

    if (!foto.type.startsWith("image/")) {
        alert("Selecione uma imagem válida.");
        return;
    }

    const leitor = new FileReader();

    leitor.onerror = function () {
        console.error("Erro ao ler a foto.");
    };

    leitor.onload = async function () {
        try {
            // Mostra a foto selecionada imediatamente.
            escolherPersonagem("Você", leitor.result, "#b9b604");

            if (!window.puter?.ai?.txt2img) {
                throw new Error("Biblioteca Puter.js não carregada.");
            }

            const desenho = await puter.ai.txt2img(
                "Transforme a pessoa desta foto em um personagem de videogame, com contorno preto grosso, cores vivas, meio corpo e fundo transparente.",
                {
                    model: "replicate:openai/gpt-image-2.5-flare",
                    quality: "medium",
                    provider: "openai",
                    input_image: leitor.result,
                    providerOptions: {
                        background: "transparent"
                    }
                }
            );

            console.log("Resultado da IA:", desenho);

            if (typeof desenho === "string") {
                escolherPersonagem("Você", desenho, "#b9b604");
            } else if (desenho instanceof HTMLImageElement) {
                escolherPersonagem("Você", desenho.src, "#b9b604");
            } else if (desenho?.src) {
                escolherPersonagem("Você", desenho.src, "#b9b604");
            } else {
                console.warn("Formato de imagem inesperado:", desenho);
            }

        } catch (erro) {
            console.error("Erro na geração da imagem:", erro);
            alert("A foto foi carregada, mas a transformação por IA falhou. Consulte o Console.");
        }
    };

    leitor.readAsDataURL(foto);
}
