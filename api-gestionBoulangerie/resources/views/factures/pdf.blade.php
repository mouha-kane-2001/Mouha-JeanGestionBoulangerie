<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture #{{ $facture->numero_facture ?? 'N/A' }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #4a90e2;
            padding-bottom: 10px;
        }
        .company-info {
            text-align: right;
        }
        .invoice-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #4a90e2;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .text-end {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-section {
            margin-top: 30px;
            border-top: 2px solid #4a90e2;
            padding-top: 10px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 0.9em;
            color: #777;
        }
        .no-items {
            padding: 20px;
            text-align: center;
            background-color: #f8f9fa;
            border-radius: 5px;
            font-style: italic;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Boulangerie Artisanale</h1>
            <p>123 Rue de la Boulangerie</p>
            <p>75000 Paris, France</p>
            <p>Tél: +33 1 23 45 67 89</p>
        </div>
        <div class="company-info">
            <h2>FACTURE</h2>
            <p>N°: <strong>{{ $facture->numero_facture ?? 'N/A' }}</strong></p>
        </div>
    </div>

    <div class="invoice-info">
        <p><strong>Date d'émission:</strong> {{ $facture->date_emission ? \Carbon\Carbon::parse($facture->date_emission)->format('d/m/Y') : 'N/A' }}</p>
        @if(isset($facture->client))
        <p><strong>Client:</strong> {{ $facture->client->nom ?? '' }} {{ $facture->client->prenom ?? '' }}</p>
        <p><strong>Adresse:</strong> {{ $facture->client->adresse ?? 'N/A' }}</p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Produit / Pack</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th class="text-end">Total</th>
            </tr>
        </thead>
        <tbody>
            @if(!empty($facture->detailsFacture) && count($facture->detailsFacture ) > 0)
                @foreach($facture->detailsFacture as $d)
                <tr>
                    <td>{{ $d->produit->nom ?? ($d->pack->nom ?? 'Produit non spécifié') }}</td>
                    <td>{{ number_format($d->prix_unitaire, 2, ',', ' ') }} FCFA</td>
                    <td>{{ $d->quantite }}</td>
                    <td class="text-end">{{ number_format($d->prix_unitaire * $d->quantite, 2, ',', ' ') }} FCFA</td>
                </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="4" class="no-items">Aucun produit ou pack dans cette facture</td>
                </tr>
            @endif
        </tbody>
    </table>

    <div class="total-section">
        <h3 class="text-end">Total: {{ number_format($facture->montant_total ?? 0, 2, ',', ' ') }} FCFA</h3>
        <p class="text-end">TVA non applicable, article 293 B du CGI</p>
    </div>

    <div class="footer">
        <p>Boulangerie Artisanale - SIRET: 123 456 789 00012 - APE: 4711F</p>
        <p>Merci pour votre confiance !</p>
    </div>
</body>
</html>
