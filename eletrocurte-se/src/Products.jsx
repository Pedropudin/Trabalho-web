const Products = [
    {
        id: 1,
        name: "HyperX Cloud II",
        setorEspecifico: "Headset/Fone de Ouvido",
        setorGeral: "Perifericos",
        marca: "HyperX",
        price: 111.0,
        inStock: 10,
        img: "https://cdn.awsli.com.br/954/954868/produto/68626025/5d150286dc.jpg",
        thumbs: [
            "https://cdn.awsli.com.br/954/954868/produto/68626025/5d150286dc.jpg",
            "https://media.istockphoto.com/id/479520746/pt/foto/laptop-com-tela-em-branco-em-branco.jpg?s=612x612&w=0&k=20&c=50nksFXbVLApBJ3YuOMn5vc5SD6-FNCFoOVIzImuh0k=",
            "https://m.media-amazon.com/images/I/71wq1QbQ1JL._AC_SL1500_.jpg"
        ],
        description: "Headset gamer confortável com som surround virtual 7.1 e microfone removível.",
        fullDescription: "O HyperX Cloud II é um headset gamer renomado, oferecendo conforto superior, som surround virtual 7.1 e microfone removível com cancelamento de ruído. Ideal para longas sessões de jogos e comunicação clara.",
        specifications: [
            "Drivers de 53mm",
            "Som Surround 7.1 virtual",
            "Microfone removível com cancelamento de ruído",
            "Compatível com PC, PS4, Xbox One e dispositivos móveis"
        ]
    },
    {
        id: 2,
        name: "Razer Kraken",
        setorEspecifico: "Headset/Fone de Ouvido",
        setorGeral: "Perifericos",
        marca: "Razer",
        price: 111.0,
        inStock: 10,
        img: "https://images.kabum.com.br/produtos/fotos/102888/102888_1559587272_g.jpg",
        thumbs: [
            "https://images.kabum.com.br/produtos/fotos/102888/102888_1559587272_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/102888/102888_1559587274_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/102888/102888_1559587276_g.jpg"
        ],
        description: "Headset com almofadas em gel refrigerante e áudio potente para gamers.",
        fullDescription: "O Razer Kraken é conhecido pelo conforto das almofadas em gel refrigerante e pelo áudio potente. Perfeito para longas sessões de jogo, oferece microfone retrátil e estrutura reforçada.",
        specifications: [
            "Drivers de 50mm",
            "Almofadas com gel refrigerante",
            "Microfone retrátil",
            "Compatível com PC, consoles e mobile"
        ]
    },
    {
        id: 3,
        name: "Steelseries Arctis Prime",
        setorEspecifico: "Headset/Fone de Ouvido",
        setorGeral: "Perifericos",
        marca: "Steelseries",
        price: 111.0,
        inStock: 10,
        img: "https://images.kabum.com.br/produtos/fotos/156155/steelseries-arctis-prime-headset-gamer_1624464470_g.jpg",
        thumbs: [
            "https://images.kabum.com.br/produtos/fotos/156155/steelseries-arctis-prime-headset-gamer_1624464470_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/156155/steelseries-arctis-prime-headset-gamer_1624464472_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/156155/steelseries-arctis-prime-headset-gamer_1624464473_g.jpg"
        ],
        description: "Headset profissional com áudio de alta fidelidade e construção robusta.",
        fullDescription: "O Arctis Prime entrega áudio de alta fidelidade, conforto premium e construção robusta em aço. Ideal para eSports e gamers que buscam desempenho profissional.",
        specifications: [
            "Drivers de alta fidelidade",
            "Estrutura em aço e alumínio",
            "Microfone ClearCast com cancelamento de ruído",
            "Compatível com múltiplas plataformas"
        ]
    },
    {
        id: 4,
        name: "Placa De Vídeo Galax, Geforce RTX 3050",
        setorEspecifico: "Placa de vídeo",
        setorGeral: "Hardware",
        marca: "Galax",
        price: 111.0,
        inStock: 9,
        img: "https://images.kabum.com.br/produtos/fotos/322427/placa-de-video-galax-geforce-rtx-3050-1-click-oc-8gb-gddr6-128bit-35nsl8md6ocv_1642699047_g.jpg",
        thumbs: [
            "https://images.kabum.com.br/produtos/fotos/322427/placa-de-video-galax-geforce-rtx-3050-1-click-oc-8gb-gddr6-128bit-35nsl8md6ocv_1642699047_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/322427/placa-de-video-galax-geforce-rtx-3050-1-click-oc-8gb-gddr6-128bit-35nsl8md6ocv_1642699050_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/322427/placa-de-video-galax-geforce-rtx-3050-1-click-oc-8gb-gddr6-128bit-35nsl8md6ocv_1642699052_g.jpg"
        ],
        description: "Placa de vídeo potente para jogos em Full HD com Ray Tracing e DLSS.",
        fullDescription: "A RTX 3050 da Galax oferece desempenho gráfico avançado para jogos em Full HD, com suporte a Ray Tracing e DLSS. Ideal para quem busca custo-benefício e tecnologia de ponta.",
        specifications: [
            "8GB GDDR6",
            "Ray Tracing e DLSS",
            "Saídas HDMI e DisplayPort",
            "Refrigeração eficiente"
        ]
    },
    {
        id: 5,
        name: "Memória RAM Corsair DDR4 2400MHz",
        setorEspecifico: "Memória",
        setorGeral: "Hardware",
        marca: "Corsair",
        price: 120.0,
        inStock: 10,
        img: "https://images.kabum.com.br/produtos/fotos/85162/85162_1516290122_g.jpg",
        thumbs: [
            "https://images.kabum.com.br/produtos/fotos/85162/85162_1516290122_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/85162/85162_1516290124_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/85162/85162_1516290126_g.jpg"
        ],
        description: "Módulo de memória DDR4 de alta performance para desktops.",
        fullDescription: "A memória Corsair DDR4 2400MHz garante mais velocidade e estabilidade para seu computador, sendo ideal para upgrades e montagem de PCs de alta performance.",
        specifications: [
            "Capacidade: 8GB",
            "Frequência: 2400MHz",
            "Padrão DDR4",
            "Compatível com Intel e AMD"
        ]
    },
    {
        id: 6,
        name: "Notebook Dell Inspiron 15",
        setorEspecifico: "Notebooks",
        setorGeral: "Computadores",
        marca: "Dell",
        price: 120.0,
        inStock: 10,
        img: "https://images.kabum.com.br/produtos/fotos/112047/notebook-dell-inspiron-i15-3501-m20p-intel-core-i5-8gb-256gb-ssd-15-6-windows-10-pro-cinza_1609858302_g.jpg",
        thumbs: [
            "https://images.kabum.com.br/produtos/fotos/112047/notebook-dell-inspiron-i15-3501-m20p-intel-core-i5-8gb-256gb-ssd-15-6-windows-10-pro-cinza_1609858302_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/112047/notebook-dell-inspiron-i15-3501-m20p-intel-core-i5-8gb-256gb-ssd-15-6-windows-10-pro-cinza_1609858304_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/112047/notebook-dell-inspiron-i15-3501-m20p-intel-core-i5-8gb-256gb-ssd-15-6-windows-10-pro-cinza_1609858306_g.jpg"
        ],
        description: "Notebook versátil com tela Full HD, SSD rápido e ótimo desempenho.",
        fullDescription: "O Dell Inspiron 15 é um notebook versátil, com ótimo desempenho para trabalho e estudos. Conta com tela Full HD, SSD rápido e design elegante.",
        specifications: [
            "Processador Intel Core i5",
            "8GB RAM, 256GB SSD",
            "Tela 15,6'' Full HD",
            "Windows 10 Pro"
        ]
    },
    {
        id: 7,
        name: "Notebook Samsung II",
        setorEspecifico: "Notebooks",
        setorGeral: "Computadores",
        marca: "Samsung",
        price: 120.0,
        inStock: 10,
        img: "https://images.kabum.com.br/produtos/fotos/112184/notebook-samsung-book-intel-core-i5-8gb-256gb-ssd-156-windows-10-home-cinza_1609860499_g.jpg",
        thumbs: [
            "https://images.kabum.com.br/produtos/fotos/112184/notebook-samsung-book-intel-core-i5-8gb-256gb-ssd-156-windows-10-home-cinza_1609860499_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/112184/notebook-samsung-book-intel-core-i5-8gb-256gb-ssd-156-windows-10-home-cinza_1609860501_g.jpg",
            "https://images.kabum.com.br/produtos/fotos/112184/notebook-samsung-book-intel-core-i5-8gb-256gb-ssd-156-windows-10-home-cinza_1609860503_g.jpg"
        ],
        description: "Notebook leve, rápido e ideal para o dia a dia com bateria de longa duração.",
        fullDescription: "O Notebook Samsung Book alia desempenho e portabilidade, sendo ideal para o dia a dia. Possui SSD, tela ampla e bateria de longa duração.",
        specifications: [
            "Processador Intel Core i5",
            "8GB RAM, 256GB SSD",
            "Tela 15,6'' Full HD",
            "Windows 10 Home"
        ]
    }
];
export default Products;