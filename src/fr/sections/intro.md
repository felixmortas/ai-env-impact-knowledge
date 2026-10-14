# Introduction

On entend souvent qu’une requête ChatGPT consomme 2,9 Wh d’électricité, soit six fois plus qu’une recherche Google, et qu’il faut environ un demi-litre d’eau pour générer 10 à 50 réponses [@enault2025impactIA].

Mais ces chiffres reflètent-ils vraiment la réalité ?

**Pas si vite !** Derrière ces affirmations se cachent des approximations et des raccourcis méthodologiques qui méritent d’être examinés de plus près.

La [calculatrice développée pour illustrer cet article](https://felixmortas.com/ai-inf-calculator) estime que ce simple message envoyé à DeepSeek a émis 0,28 g de CO₂ équivalent (gCO₂e) et consommé 0,06 mL d’eau. C'est l'équivalent d'une ampoule allumée 6 minutes, et d'1 goutte d'eau.

*L'estimation prend en compte le texte visible du chatbot, l'électricité utilisée pour faire fonctionner l'IA, et l'eau pour refroidir le data center. Elle ne prend pas en compte le raisonnement de l'IA, les boucles d'action, l'entraînement du modèle, la fabrication du matériel informatique et du data center, l'utilisation du réseau, l'eau consommée pour produire l'électricité*

![Conversation courte avec DeepSeek](images/small-prompt.png){width=60%}

Pourtant, [la calculatrice](https://felixmortas.com/ai-inf-calculator) estime que ce message bien plus complexe envoyé à Claude a lui émis 7,48 gCO₂e et consommé 2 mL d’eau. C'est l'équivalent d'une ampoule allumée 3 heures et 53 minutes, et de 40 gouttes d'eau.

![Conversation plus complexe avec Claude](images/big-prompt.png){width=60%}

**Comment expliquer une telle différence ?**

L’impact environnemental d’une interaction avec une IA dépend de nombreux paramètres. Plusieurs facteurs entrent en jeu.

Dans cet article, nous allons décrypter ce qui se cache derrière ces chiffres et comprendre ce qui fait réellement varier l’empreinte environnementale de nos échanges avec l’IA.

Dans un contexte de changement climatique lié aux activités humaines [@IPCC2021SPM], même le pape s'inquiète des risques engendrés par l'IA [@leoXIV2026MagnificaHumanitas].

Le rapport « Energy and AI » publié par l’IEA en avril 2025 prévoit que la demande mondiale en énergie pour les centres de données va doubler et passer à environ 945 TWh d’ici 2030 — soit un niveau comparable à la consommation annuelle d’électricité du Japon —, et qui devrait atteindre environ 1 200 TWh d’ici 2035 [@iea2025energy].
Les Nations Unies ont récemment publié un rapport sur l'impact environnemental de l'IA au niveau des émissions carbones et de la consommation d'eau [@aczel2026environmental].

Les organisations ainsi que les particuliers doivent contrôler leur empreinte environnementale. Des conseils concrets et réels pour la réduction de cet impact sont nécessaires au niveau des utilisateurs et des développeurs. Mais pour agir de manière effiace, il faut premièrement comprendre certains aspects de son fonctionnement. 

A travers cet article, vous allez également vous rendre compte qu'adopter de bonnes pratiques environnementales conduit généralement à une utilisation plus efficace de l'IA.