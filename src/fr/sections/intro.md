# Intro

On entend souvent qu’une requête ChatGPT consomme 2,9 Wh d’électricité, soit six fois plus qu’une recherche Google, et qu’il faut environ un demi-litre d’eau pour générer 10 à 50 réponses [@enault2025impactIA].

Mais ces chiffres reflètent-ils vraiment la réalité ?

**Pas si vite !** Derrière ces affirmations se cachent des approximations et des raccourcis méthodologiques qui méritent d’être examinés de plus près.

D’après mes calculs, ce simple message envoyé à DeepSeek a émis 0,28 gCO₂e et consommé 0,06 mL d’eau, soit environ x x et 1 goutte d'eau.

![Message court envoyé à DeepSeek : demande d'amélioration d'un paragraphe (1/3)](images/small-prompt-1.png){width=80%}
![Message court envoyé à DeepSeek : début de la réponse (2/3)](images/small-prompt-2.png){width=80%}
![Message court envoyé à DeepSeek : fin de la réponse et corrections apportées (3/3)](images/small-prompt-3.png){width=80%}

Pourtant, ce message bien plus complexe envoyé à Claude a lui émis 3,23 g de CO₂e et consommé 0,8 mL d’eau, soit environ xx et 16 gouttes d'eau.

![Message complexe envoyé à Claude : spécification du modèle de calcul (1/3)](images/big-prompt-1.png){width=80%}
![Message complexe envoyé à Claude : fin de la demande et début de la réponse (2/3)](images/big-prompt-2.png){width=80%}
![Message complexe envoyé à Claude : pipeline de calcul et document livré (3/3)](images/big-prompt-3.png){width=80%}

**Comment expliquer une telle différence ?**

L’impact environnemental d’une interaction avec une IA dépend de nombreux paramètres. Plusieurs facteurs entrent en jeu.

Dans cet article, nous allons décrypter ce qui se cache derrière ces chiffres et comprendre ce qui fait réellement varier l’empreinte environnementale de nos échanges avec l’IA.

Dans un contexte de changement climatique lié aux activités humaines [@IPCC2021SPM], même le pape s'inquiète des risques engendrés par l'IA [@leoXIV2026MagnificaHumanitas].

Le rapport « Energy and AI » publié par l’IEA en avril 2025 prévoit que la demande mondiale en énergie pour les centres de données va doubler et passer à environ 945 TWh d’ici 2030 — soit un niveau comparable à la consommation annuelle d’électricité du Japon —, et qui devrait atteindre environ 1 200 TWh d’ici 2035 [@iea2025energy].
Les Nations Unies ont récemment publié un rapport sur l'impact environnemental de l'IA au niveau des émissions carbones et de la consommation d'eau [@aczel2026environmental].

Les organisations ainsi que les particuliers doivent contrôler leur empreinte environnementale. Mais pour agir de manière effiace, il faut premièrement comprendre quelques aspects de son fonctionnement. Des conseils concrets et réels pour la réduction de cet impact sont nécessaires au niveau des utilisateurs et des développeurs.

A travers cet article, vous allez également vous rendre compte qu'adopter de bonnes pratiques environnementales conduit généralement à une utilisation plus efficace de l'outil.