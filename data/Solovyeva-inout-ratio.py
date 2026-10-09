"""
DOCUMENT SCIENTIFIQUE — ÉNERGIE PAR TOKEN D'ENTRÉE VS TOKEN DE SORTIE
======================================================================

Source principale
------------------
L. Solovyeva & F. Castor, "Towards Green AI: Decoding the Energy of LLM
Inference in Software Development", arXiv:2602.05712v1, 5 February 2026.

PDF :
https://ris.utwente.nl/ws/portalfiles/portal/538862218/2602.05712v1.pdf

RÉFÉRENCES AUX TABLES
---------------------
Table 1 :
    - longueur moyenne de sortie ;
    - énergie totale moyenne par inférence.

Table 2 :
    - contribution moyenne du préfill à l'énergie totale, en %.

Table 3 :
    - nombre moyen de tokens d'entrée.

Table 4 :
    - énergie moyenne par token pendant le décodage, en J/token.

FORMULATION
-----------
Pour une expérience i :

    E_total_i          = énergie totale de l'inférence [J]
    p_prefill_i        = fraction d'énergie due au préfill
    N_input_i          = nombre moyen de tokens d'entrée
    e_decode_i         = énergie moyenne d'un token de sortie [J/token]

On estime alors l'énergie du préfill :

    E_prefill_i = E_total_i * p_prefill_i

Puis l'énergie moyenne par token d'entrée :

    e_input_i = E_prefill_i / N_input_i

Le ratio recherché est :

    R_i = e_decode_i / e_input_i

soit :

    R_i = e_decode_i * N_input_i
          ------------------------
          E_total_i * p_prefill_i

INTERPRÉTATION
--------------
Si R = 100, cela signifie qu'au sein de la définition et du protocole de
mesure de cette étude, un token généré consomme en moyenne 100 fois plus
d'énergie qu'un token d'entrée.

Il ne faut PAS interpréter R comme une loi universelle des LLM.

Pourquoi ?
  - Le coût du préfill n'est pas linéairement proportionnel au nombre
    de tokens d'entrée.
  - Le coût du décodage dépend notamment de la longueur déjà générée.
  - Le KV-cache influence le coût de génération.
  - Le comportement dépend du modèle, du tokenizer, du matériel et du
    runtime.
  - L'étude utilise une NVIDIA A10 de 24 Go et mesure l'énergie GPU.
  - Les 50 configurations correspondent à 10 modèles × 5 workloads.
  - Chaque essai expérimental a été exécuté une seule fois.

DONNÉES TRANSCRITES DES TABLES
------------------------------
Les valeurs ci-dessous sont celles publiées dans les Tables 1 à 4.

Ordre des workloads :
    0-shot, 2-shot, 0-shot CoT, CU, CU-long

Les unités sont :
    total_energy : J / inférence
    output_tokens : tokens / inférence
    prefill_percent : %
    input_tokens : tokens / inférence
    decode_j_per_token : J / token de décodage
"""

# ---------------------------------------------------------------------------
# DONNÉES
# ---------------------------------------------------------------------------

WORKLOADS = ("0-shot", "2-shot", "0-shot CoT", "CU", "CU-long")

DATA = {
    "CodeLlama-7B": {
        "output_tokens": [207, 248, 1765, 10, 300],
        "total_energy": [1082, 1369, 10069, 258, 2582],
        "prefill_percent": [0.7, 1.6, 0.1, 84.4, 7.7],
        "input_tokens": [163, 593, 169, 5555, 5503],
        "decode_j_per_token": [5.21, 5.44, 5.64, 7.82, 7.97],
    },
    "Qwen2.5-Coder-7B": {
        "output_tokens": [107, 97, 107, 10, 279],
        "total_energy": [575, 541, 576, 188, 1661],
        "prefill_percent": [1.4, 3.4, 1.5, 74.9, 8.8],
        "input_tokens": [137, 504, 145, 4287, 4221],
        "decode_j_per_token": [5.31, 5.43, 5.33, 5.37, 5.46],
    },
    "Deepseek-Coder-6.7B": {
        "output_tokens": [300, 300, 1989, 10, 300],
        "total_energy": [1567, 1664, 11338, 265, 2579],
        "prefill_percent": [0.4, 1.4, 0.1, 73.4, 7.6],
        "input_tokens": [162, 586, 169, 5542, 5491],
        "decode_j_per_token": [5.22, 5.48, 5.72, 7.82, 7.97],
    },
    "CodeGemma-7B": {
        "output_tokens": [86, 117, 101, 10, 80],
        "total_energy": [553, 797, 654, 270, 870],
        "prefill_percent": [1.2, 2.8, 0.9, 72.6, 22.8],
        "input_tokens": [155, 559, 161, 4888, 4812],
        "decode_j_per_token": [6.45, 6.65, 6.46, 8.44, 8.51],
    },
    "CodeQwen1.5-7B": {
        "output_tokens": [155, 112, 150, 10, 300],
        "total_energy": [805, 628, 823, 230, 1834],
        "prefill_percent": [0.9, 3.4, 1.1, 79.9, 10.1],
        "input_tokens": [158, 582, 163, 5298, 5226],
        "decode_j_per_token": [5.18, 5.45, 5.33, 5.45, 5.52],
    },
    "NextCoder-7B": {
        "output_tokens": [160, 274, 321, 10, 104],
        "total_energy": [831, 1448, 1780, 187, 708],
        "prefill_percent": [0.8, 1.2, 0.5, 77.1, 20.5],
        "input_tokens": [136, 503, 146, 4278, 4204],
        "decode_j_per_token": [5.18, 5.25, 5.34, 5.42, 5.46],
    },
    "Phi3.5-4B": {
        "output_tokens": [161, 125, 262, 10, 250],
        "total_energy": [670, 531, 1144, 170, 1450],
        "prefill_percent": [0.8, 2.5, 0.5, 72.1, 8.7],
        "input_tokens": [162, 593, 168, 5554, 5501],
        "decode_j_per_token": [4.14, 4.15, 4.35, 5.31, 5.44],
    },
    "Phi4-4B": {
        "output_tokens": [132, 99, 214, 10, 149],
        "total_energy": [560, 431, 976, 111, 768],
        "prefill_percent": [0.8, 2.2, 0.5, 67.3, 10.3],
        "input_tokens": [134, 493, 143, 4144, 4078],
        "decode_j_per_token": [4.22, 4.31, 4.49, 4.45, 4.63],
    },
    "Qwen3-4B": {
        "output_tokens": [299, 299, 1819, 10, 299],
        "total_energy": [1508, 1606, 9853, 144, 1812],
        "prefill_percent": [0.4, 0.7, 0.1, 68.3, 5.6],
        "input_tokens": [138, 500, 144, 4244, 4184],
        "decode_j_per_token": [5.04, 5.35, 5.41, 5.65, 5.74],
    },
    "Qwen2.5-Coder-3B": {
        "output_tokens": [260, 241, 82, 10, 275],
        "total_energy": [1021, 1000, 334, 100, 1218],
        "prefill_percent": [0.4, 0.8, 1.4, 64.9, 5.1],
        "input_tokens": [137, 505, 145, 4268, 4213],
        "decode_j_per_token": [3.93, 4.02, 4.05, 4.49, 4.22],
    },
}


# ---------------------------------------------------------------------------
# CALCUL DU RATIO
# ---------------------------------------------------------------------------

def compute_ratio(model_data, workload_index):
    """
    Calcule le ratio :

        J/token_output / J/token_input

    à partir des moyennes publiées.

    Important :
    Le dénominateur est une estimation, car le papier ne publie pas
    explicitement J/token_input. On reconstruit :

        E_prefill = E_total * contribution_prefill
        J/token_input = E_prefill / N_input

    Le numérateur est directement la métrique "Energy per Token in
    Decoding" publiée dans la Table 4.
    """
    total = model_data["total_energy"][workload_index]
    p = model_data["prefill_percent"][workload_index] / 100.0
    n_input = model_data["input_tokens"][workload_index]
    e_decode = model_data["decode_j_per_token"][workload_index]

    e_prefill = total * p
    e_input = e_prefill / n_input

    return e_decode / e_input


# ---------------------------------------------------------------------------
# CALCULS DES 50 CONFIGURATIONS
# ---------------------------------------------------------------------------

ratios = []

for model, values in DATA.items():
    for i, workload in enumerate(WORKLOADS):
        ratio = compute_ratio(values, i)
        ratios.append(
            {
                "model": model,
                "workload": workload,
                "ratio": ratio,
            }
        )

mean_ratio = sum(row["ratio"] for row in ratios) / len(ratios)
sorted_ratios = sorted(row["ratio"] for row in ratios)

n = len(sorted_ratios)
if n % 2:
    median_ratio = sorted_ratios[n // 2]
else:
    median_ratio = (
        sorted_ratios[n // 2 - 1] + sorted_ratios[n // 2]
    ) / 2

min_ratio = min(sorted_ratios)
max_ratio = max(sorted_ratios)


# ---------------------------------------------------------------------------
# AUTRE QUANTITÉ UTILE : "ENERGIE MOYENNE PAR TOKEN DE SORTIE"
# ---------------------------------------------------------------------------
#
# Il est également possible de comparer l'énergie moyenne de l'inférence
# par token généré à l'énergie moyenne par token d'entrée.
#
# Mais cette quantité mélange le préfill et le décodage dans son numérateur :
#
#     E_total / N_output
#
# Elle ne doit donc PAS être appelée "énergie du token de sortie" au sens
# strict de la phase de décodage.
#
# On la calcule ici uniquement pour montrer pourquoi plusieurs ratios
# différents peuvent apparaître selon la définition choisie.

alternative_ratios = []

for model, values in DATA.items():
    for i, workload in enumerate(WORKLOADS):
        total = values["total_energy"][i]
        n_output = values["output_tokens"][i]
        p = values["prefill_percent"][i] / 100.0
        n_input = values["input_tokens"][i]

        e_input = total * p / n_input
        e_total_per_output = total / n_output

        alternative_ratios.append(e_total_per_output / e_input)

alternative_mean = sum(alternative_ratios) / len(alternative_ratios)


# ---------------------------------------------------------------------------
# AFFICHAGE
# ---------------------------------------------------------------------------

print("=" * 78)
print("ÉTUDE DU RATIO ÉNERGÉTIQUE INPUT / OUTPUT")
print("=" * 78)
print()
print("Définition principale :")
print("    R = (J/token en décodage) / (J/token d'entrée estimé)")
print()
print(f"Nombre de configurations : {len(ratios)}")
print(f"Moyenne arithmétique     : {mean_ratio:.2f}×")
print(f"Médiane                  : {median_ratio:.2f}×")
print(f"Minimum                  : {min_ratio:.2f}×")
print(f"Maximum                  : {max_ratio:.2f}×")
print()
print("Ratio alternatif, si l'on utilise E_total/N_output au numérateur :")
print(f"    moyenne = {alternative_mean:.2f}×")
print()
print("IMPORTANT : ces deux moyennes ne sont pas interchangeables.")
print("Le premier ratio est le plus proche de la question")
print("'combien coûte un token de sortie de décodage par rapport à un")
print("token d'entrée de préfill ?'.")
print()
print("Conclusion : le chiffre 504× annoncé précédemment ne se reproduit")
print("pas avec les données et définitions publiées dans le papier.")
print("=" * 78)


# ---------------------------------------------------------------------------
# CONTROLE DE COHERENCE
# ---------------------------------------------------------------------------
#
# Le papier donne, pour CU, une contribution du préfill comprise entre
# 64.9 % et 84.4 %. C'est cohérent avec l'intuition : lorsque l'entrée
# contient ~4 000–8 000 tokens mais que la sortie est limitée à 10 tokens,
# le préfill peut devenir dominant.
#
# À l'inverse, pour les workloads 0-shot, 2-shot et 0-shot CoT, le préfill
# représente généralement une petite fraction de l'énergie totale.
#
# Cela démontre pourquoi aucun ratio universel "X fois" ne doit être
# appliqué indépendamment du workload.

# ---------------------------------------------------------------------------
# CONCLUSION SCIENTIFIQUE
# ---------------------------------------------------------------------------
#
#      Dans cette étude, le coût énergétique par token de décodage est
#      généralement très supérieur au coût énergétique moyen attribuable
#      à un token d'entrée lorsqu'on répartit l'énergie de préfill sur les
#      tokens d'entrée. Toutefois, le facteur dépend fortement du modèle
#      et du workload et ne constitue pas une constante universelle."
#
# Le calcul reproductible ci-dessus donne une moyenne arithmétique d'environ
# 167× pour la définition stricte :
#
#     (J/token de décodage) / (J/token de préfill attribué à un token input)
#
# avec une médiane d'environ 156× et une plage d'environ 79× à 295× sur
# les 50 configurations.

if __name__ == "__main__":
    # L'exécution du fichier imprime les principaux résultats.
    pass
