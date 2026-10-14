On entend souvent qu’une requête ChatGPT consomme six fois plus d’électricité qu’une recherche Google, et qu’il faut environ un demi-litre d’eau pour générer 10 à 50 réponses [@enault2025impactIA].

Mais ces chiffres reflètent-ils vraiment la réalité ?

**Pas si vite !** Derrière ces affirmations se cachent des approximations et des raccourcis méthodologiques qui méritent d’être examinés de plus près.

La [calculatrice conçue pour illustrer cet article](https://felixmortas.com/ai-inf-calculator) estime que ce simple message envoyé à DeepSeek a émis 0,28 g de CO₂ équivalent (gCO₂e) et consommé 0,06 mL d’eau. C'est l'équivalent d'une ampoule allumée pendant 6 minutes, et d'1 goutte d'eau.

![Conversation simple avec DeepSeek](images/small-prompt.png){width=60%}

Pourtant, [la calculatrice](https://felixmortas.com/ai-inf-calculator) estime que cet échange bien plus complexe avec Claude a lui émis 7,48 gCO₂e et consommé 2 mL d’eau. C'est l'équivalent d'une ampoule allumée pendant 3 heures et 53 minutes, et de 40 gouttes d'eau.

![Conversation plus complexe avec Claude](images/big-prompt.png){width=60%}

*Les estimations prennent en compte le texte visible du chatbot, l'électricité utilisée pour faire fonctionner l'IA, et l'eau pour refroidir le data center. Elles ne prennent pas en compte le raisonnement de l'IA, les boucles d'action, l'entraînement du modèle, la fabrication du matériel informatique et du data center, l'utilisation du réseau, l'eau consommée pour produire l'électricité. L'impact environnemental global est donc largement sous-estimé.*

**Mais comment expliquer une telle différence ?**

Dans cet article, nous allons décrypter ce qui se cache derrière ces chiffres et comprendre ce qui fait réellement varier l’empreinte environnementale de nos conversations avec l’IA. Vous allez également vous rendre compte qu'adopter de bonnes pratiques environnementales conduit généralement à une utilisation plus efficace.

# Introduction

Dans un contexte de changement climatique lié aux activités humaines [@IPCC2021SPM], même le pape s'inquiète des risques engendrés par l'IA [@leoXIV2026MagnificaHumanitas].

Le rapport « Energy and AI » publié par l’IEA en avril 2025 prévoit que la demande mondiale en énergie pour les centres de données va doubler et passer à environ 945 TWh d’ici 2030 — soit un niveau comparable à la consommation annuelle d’électricité du Japon —, et qui devrait atteindre environ 1 200 TWh d’ici 2035 [@iea2025energy].
Les Nations Unies ont récemment publié un rapport sur l'impact environnemental de l'IA au niveau des émissions carbone et de la consommation d'eau [@aczel2026environmental].

Les organisations ainsi que les particuliers doivent contrôler leur empreinte environnementale. Des conseils concrets et réels pour la réduction de cet impact sont nécessaires au niveau des utilisateurs et des développeurs. Mais pour agir de manière efficace, il faut premièrement comprendre certains aspects du fonctionnement de l'IA. 

J'ai réalisé des travaux de recherche sur l'impact environnemental de l'IA générative pendant 18 mois chez AXA, ce qui m'a permis d'accumuler de nombreuses connaissances sur le sujet que je souhaite aujourd'hui partager avec vous.

À travers cet article, [vous comprendrez](#facteurs-influençant-limpact-environnemental-de-lia-générative) quels sont les facteurs qui influencent le plus l'impact environnemental de l'IA, comment [le mesurer](#mesurer-limpact-environnemental-de-lia-générative) lorsque c'est possible, et comment [le réduire](#réduire-son-impact-environnemental-en-mettant-en-place-des-bonnes-pratiques) en tant qu'utilisateur final et développeur. 

Vous découvrirez également [ce calculateur](https://felixmortas.com/ai-inf-calculator/) vous permettant de mesurer l'impact d'une de vos conversations avec un chatbot (ChatGPT, Claude, Gemini, mais aussi Mistral, DeepSeek, etc.). Vous pourrez également simuler l'application de certaines bonnes pratiques sur cette même conversation, et ainsi vous rendre compte de la pertinence de celles-ci.

*Ce calculateur **n'a pas pour objectif** de concurrencer les méthodes d'estimation existantes, ni de fournir une mesure certaine. Il a pour objectif d'illustrer l'efficacité des bonnes pratiques présentées dans cet article.*