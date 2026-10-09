"""
L’analyse donne un résultat assez net : **il n’y a pas de corrélation statistiquement significative entre le nombre de paramètres et le ratio Eout/Ein** avec ces données.

### Résultats

Le ratio est calculé comme :

$$
\text{ratio} = \frac{E_{out}}{E_{in}}
$$

Sur les 16 modèles :

* moyenne : **0,83337**
* écart-type : **0,000080**

Le ratio est **pratiquement constant autour de 5/6 ≈ 0,83333**.

### Conclusion

Statistiquement, rien ne montre que le nombre de paramètres explique le ratio.

Une prédiction raisonnable serait simplement :

```python
def predict_ratio(params_b):
    return 5 / 6
```
"""

import numpy as np
import pandas as pd
from scipy import stats

# Données
"""@misc{vartziotis2026tokenswatthoursanalyticalenergy,
    title={From Tokens to Watt-hours: Analytical Energy Estimation for LLM Inference on Modern GPUs}, 
    author={Tina Vartziotis and Rodopi Kosteli and Elli Vartziotis and George Dasoulas and Michael Keckeisen and Konstantinos Skianis and Sotirios Kotsopoulos and Francesca Dominici},
    year={2026},
    eprint={2607.26571},
    archivePrefix={arXiv},
    primaryClass={cs.LG},
    url={https://arxiv.org/abs/2607.26571}}"""

data = [        
    ("EmbeddingGemma", 0.308, 0.961, 1.153),
    ("MXBAI Embed Large", 0.334, 1.042, 1.250),
    ("Qwen3 Embedding", 0.600, 1.872, 2.246),
    ("Qwen3 (1.7B)", 1.700, 5.304, 6.365),
    ("Granite 3.2 Vision", 2.530, 7.894, 9.472),
    ("Qwen3 (8B)", 8.000, 24.960, 29.952),
    ("Granite 3.3", 8.170, 25.490, 30.588),
    ("Ministral 3 (14B)", 14.000, 43.680, 52.416),
    ("DeepSeek-Coder V2", 16.000, 49.920, 59.904),
    ("GPT-OSS (20B)", 20.000, 62.400, 74.880),
    ("Qwen3 (32B)", 32.000, 99.840, 119.808),
    ("Qwen2.5-Coder (32B)", 32.000, 99.840, 119.808),
    ("Qwen3-VL (32B)", 32.000, 99.840, 119.808),
    ("DeepSeek-R1", 32.000, 99.840, 119.808),
    ("Llama 3.3 (70B)", 70.000, 218.400, 262.080),
    ("GPT-OSS (120B)", 120.000, 374.400, 449.280),
]

df = pd.DataFrame(
    data,
    columns=["Model", "Params_B", "Eout", "Ein"]
)

# Calcul du ratio
df["Ratio"] = df["Eout"] / df["Ein"]

print("Ratios Eout/Ein :")
print(df[["Model", "Params_B", "Ratio"]].to_string(index=False))

print(f"\nRatio moyen : {df['Ratio'].mean():.6f}")
print(f"Écart-type  : {df['Ratio'].std():.6f}")

# --------------------------------------------------
# 1. Test de normalité
# --------------------------------------------------
shapiro_stat, shapiro_p = stats.shapiro(df["Ratio"])

print("\nTest de Shapiro-Wilk")
print(f"Statistic = {shapiro_stat:.4f}")
print(f"p-value   = {shapiro_p:.6g}")

normal = shapiro_p > 0.05

if normal:
    print("=> Les ratios sont compatibles avec une loi normale.")
else:
    print("=> Les ratios ne suivent pas une loi normale.")

# --------------------------------------------------
# 2. Test de corrélation
# --------------------------------------------------
if normal:
    # Pearson si les données sont normales
    corr, p_value = stats.pearsonr(
        df["Params_B"],
        df["Ratio"]
    )
    test_name = "Pearson"
else:
    # Spearman sinon
    corr, p_value = stats.spearmanr(
        df["Params_B"],
        df["Ratio"]
    )
    test_name = "Spearman"

print(f"\nTest de corrélation : {test_name}")
print(f"Coefficient = {corr:.4f}")
print(f"p-value     = {p_value:.4f}")

if p_value < 0.05:
    print("=> Corrélation statistiquement significative.")
else:
    print("=> Pas de corrélation statistiquement significative.")

# --------------------------------------------------
# 3. Prédiction éventuelle
# --------------------------------------------------
if p_value < 0.05:
    print("\nUne relation entre le nombre de paramètres et le ratio")
    print("pourrait être modélisée.")
else:
    print("\nPas de fonction de prédiction basée sur les paramètres,")
    print("car aucune corrélation significative n'a été détectée.")