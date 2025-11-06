const pays = [
    {
        CODE: "AF",
        NOM: "Afghanistan",
        VILLE: "Kaboul",
    },
    {
        CODE: "ZA",
        NOM: "Afrique du Sud",
        VILLE: "Le Cap",
    },
    {
        CODE: "AL",
        NOM: "Albanie",
        VILLE: "Saranda",
    },
    {
        CODE: "DZ",
        NOM: "Algérie",
        VILLE: "Alger",
    },
    {
        CODE: "DE",
        NOM: "Allemagne",
        VILLE: "Berlin",
    },
    {
        CODE: "AD",
        NOM: "Andorre",
        VILLE: "Andore-la-Vieille",
    },
    {
        CODE: "AO",
        NOM: "Angola",
        VILLE: "Luanda",
    },
    {
        CODE: "AI",
        NOM: "Anguilla",
        VILLE: "The Valley",
    },
    {
        CODE: "AQ",
        NOM: "Antarctique",
        VILLE: "Port Lockroy",
    },
    {
        CODE: "AG",
        NOM: "Antigua-et-Barbuda",
        VILLE: "Saint John's",
    },
    {
        CODE: "SA",
        NOM: "Arabie saoudite",
        VILLE: "Riyad",
    },
    {
        CODE: "AR",
        NOM: "Argentine",
        VILLE: "Buenos Aires",
    },
    {
        CODE: "AM",
        NOM: "Arménie",
        VILLE: "Erevan",
    },
    {
        CODE: "AW",
        NOM: "Aruba",
        VILLE: "Oranjestad",
    },
    {
        CODE: "AU",
        NOM: "Australie",
        VILLE: "Sydney",
    },
    {
        CODE: "AT",
        NOM: "Autriche",
        VILLE: "Vienne",
    },
    {
        CODE: "AZ",
        NOM: "Azerbaïdjan",
        VILLE: "Bakou",
    },
    {
        CODE: "BS",
        NOM: "Bahamas",
        VILLE: "Nassau",
    },
    {
        CODE: "BH",
        NOM: "Bahreïn",
        VILLE: "Manama",
    },
    {
        CODE: "BD",
        NOM: "Bangladesh",
        VILLE: "Cox's Bazar",
    },
    {
        CODE: "BB",
        NOM: "Barbade",
        VILLE: "Bridgetown",
    },
    {
        CODE: "BE",
        NOM: "Belgique",
        VILLE: "Bruges",
    },
    {
        CODE: "BZ",
        NOM: "Belize",
        VILLE: "San Pedro",
    },
    {
        CODE: "BJ",
        NOM: "Bénin",
        VILLE: "Ganvié",
    },
    {
        CODE: "BM",
        NOM: "Bermudes",
        VILLE: "Hamilton",
    },
    {
        CODE: "BT",
        NOM: "Bhoutan",
        VILLE: "Timphou",
    },
    {
        CODE: "BY",
        NOM: "Biélorussie",
        VILLE: "Minsk",
    },
    {
        CODE: "BO",
        NOM: "Bolivie",
        VILLE: "La Paz",
    },
    {
        CODE: "BA",
        NOM: "Bosnie-Herzégovine",
        VILLE: "Sarajevo",
    },
    {
        CODE: "BW",
        NOM: "Botswana",
        VILLE: "Maun",
    },
    {
        CODE: "BR",
        NOM: "Brésil",
        VILLE: "Rio de Janeiro",
    },
    {
        CODE: "BN",
        NOM: "Brunei",
        VILLE: "Bandar Seri Begawan",
    },
    {
        CODE: "BG",
        NOM: "Bulgarie",
        VILLE: "Sofia",
    },
    {
        CODE: "BF",
        NOM: "Burkina Faso",
        VILLE: "Ouagadougou",
    },
    {
        CODE: "BI",
        NOM: "Burundi",
        VILLE: "Bujumbura",
    },
    {
        CODE: "KH",
        NOM: "Cambodge",
        VILLE: "Siem Reap",
    },
    {
        CODE: "CM",
        NOM: "Cameroun",
        VILLE: "Douala",
    },
    {
        CODE: "CA",
        NOM: "Canada",
        VILLE: "Toronto",
    },
    {
        CODE: "CV",
        NOM: "Cap-Vert",
        VILLE: "Santa Maria",
    },
    {
        CODE: "CL",
        NOM: "Chili",
        VILLE: "Santiago",
    },
    {
        CODE: "CN",
        NOM: "Chine",
        VILLE: "Pékin",
    },
    {
        CODE: "CY",
        NOM: "Chypre",
        VILLE: "Paphos",
    },
    {
        CODE: "CO",
        NOM: "Colombie",
        VILLE: "Bogota",
    },
    {
        CODE: "KM",
        NOM: "Comores",
        VILLE: "Moroni",
    },
    {
        CODE: "CG",
        NOM: "Congo-Brazzaville",
        VILLE: "Brazzaville",
    },
    {
        CODE: "CD",
        NOM: "Congo-Kinshasa",
        VILLE: "Kinshasa",
    },
    {
        CODE: "KP",
        NOM: "Corée du Nord",
        VILLE: "Pyongyang",
    },
    {
        CODE: "KR",
        NOM: "Corée du Sud",
        VILLE: "Séoul",
    },
    {
        CODE: "CR",
        NOM: "Costa Rica",
        VILLE: "San José",
    },
    {
        CODE: "CI",
        NOM: "Côte d'Ivoire",
        VILLE: "Abidjan",
    },
    {
        CODE: "HR",
        NOM: "Croatie",
        VILLE: "Dubrovnik",
    },
    {
        CODE: "CU",
        NOM: "Cuba",
        VILLE: "La Havane",
    },
    {
        CODE: "CW",
        NOM: "Curaçao",
        VILLE: "Lagun",
    },
    {
        CODE: "DK",
        NOM: "Danemark",
        VILLE: "Copenhague",
    },
    {
        CODE: "DJ",
        NOM: "Djibouti",
        VILLE: "Djibouti",
    },
    {
        CODE: "DM",
        NOM: "Dominique",
        VILLE: "Roseau",
    },
    {
        CODE: "EG",
        NOM: "Égypte",
        VILLE: "Le Caire",
    },
    {
        CODE: "AE",
        NOM: "Émirats arabes unis",
        VILLE: "Dubaï",
    },
    {
        CODE: "EC",
        NOM: "Équateur",
        VILLE: "Quito",
    },
    {
        CODE: "ER",
        NOM: "Érythrée",
        VILLE: "Asmara",
    },
    {
        CODE: "ES",
        NOM: "Espagne",
        VILLE: "Madrid",
    },
    {
        CODE: "EE",
        NOM: "Estonie",
        VILLE: "Tallinn",
    },
    {
        CODE: "SZ",
        NOM: "Eswatini",
        VILLE: "Mbabane",
    },
    {
        CODE: "VA",
        NOM: "État de la Cité du Vatican",
        VILLE: "Vatican",
    },
    {
        CODE: "US",
        NOM: "États-Unis",
        VILLE: "New York",
    },
    {
        CODE: "ET",
        NOM: "Éthiopie",
        VILLE: "Addis-Abeba",
    },
    {
        CODE: "FJ",
        NOM: "Fidji",
        VILLE: "Suva",
    },
    {
        CODE: "FI",
        NOM: "Finlande",
        VILLE: "Helsinki",
    },
    {
        CODE: "FR",
        NOM: "France",
        VILLE: "Paris",
    },
    {
        CODE: "GA",
        NOM: "Gabon",
        VILLE: "Libreville",
    },
    {
        CODE: "GM",
        NOM: "Gambie",
        VILLE: "Kololi",
    },
    {
        CODE: "GE",
        NOM: "Géorgie",
        VILLE: "Tbilissi",
    },
    {
        CODE: "GS",
        NOM: "Géorgie du Sud-et-les Îles Sandwich du Sud",
        VILLE: "King Edward Point",
    },
    {
        CODE: "GH",
        NOM: "Ghana",
        VILLE: "Accra",
    },
    {
        CODE: "GI",
        NOM: "Gibraltar",
        VILLE: "Gibraltar",
    },
    {
        CODE: "GR",
        NOM: "Grèce",
        VILLE: "Athènes",
    },
    {
        CODE: "GD",
        NOM: "Grenade",
        VILLE: "Saint-Georges",
    },
    {
        CODE: "GL",
        NOM: "Groenland",
        VILLE: "Ilulissat",
    },
    {
        CODE: "GP",
        NOM: "Guadeloupe",
        VILLE: "Pointe-à-Pitre",
    },
    {
        CODE: "GU",
        NOM: "Guam",
        VILLE: "Tumon",
    },
    {
        CODE: "GT",
        NOM: "Guatemala",
        VILLE: "Antigua",
    },
    {
        CODE: "GG",
        NOM: "Guernesey",
        VILLE: "Saint-Peter-Port",
    },
    {
        CODE: "GN",
        NOM: "Guinée",
        VILLE: "Conakry",
    },
    {
        CODE: "GQ",
        NOM: "Guinée équatoriale",
        VILLE: "Malabo",
    },
    {
        CODE: "GW",
        NOM: "Guinée-Bissau",
        VILLE: "Bissau",
    },
    {
        CODE: "GY",
        NOM: "Guyana",
        VILLE: "Georgetown",
    },
    {
        CODE: "GF",
        NOM: "Guyane française",
        VILLE: "Cayenne",
    },
    {
        CODE: "HT",
        NOM: "Haïti",
        VILLE: "Port-au-Prince",
    },
    {
        CODE: "HN",
        NOM: "Honduras",
        VILLE: "Tegucigalpa",
    },
    {
        CODE: "HK",
        NOM: "Hong Kong",
        VILLE: "Hong Kong",
    },
    {
        CODE: "HU",
        NOM: "Hongrie",
        VILLE: "Budapest",
    },
    {
        CODE: "BV",
        NOM: "Île Bouvet",
        VILLE: "Île Bouvet",
    },
    {
        CODE: "CX",
        NOM: "Île Christmas",
        VILLE: "Flying Fish Cove",
    },
    {
        CODE: "IM",
        NOM: "Île de Man",
        VILLE: "Douglas",
    },
    {
        CODE: "NF",
        NOM: "Île Norfolk",
        VILLE: "Kingston",
    },
    {
        CODE: "AX",
        NOM: "Îles Åland",
        VILLE: "Mariehamn",
    },
    {
        CODE: "KY",
        NOM: "Îles Caïmans",
        VILLE: "George Town",
    },
    {
        CODE: "CC",
        NOM: "Îles Cocos",
        VILLE: "West Island",
    },
    {
        CODE: "CK",
        NOM: "Îles Cook",
        VILLE: "Ratoronga",
    },
    {
        CODE: "FO",
        NOM: "Îles Féroé",
        VILLE: "Tórshavn",
    },
    {
        CODE: "HM",
        NOM: "Îles Heard-et-MacDonald",
        VILLE: "Îles Heard-et-MacDonald",
    },
    {
        CODE: "FK",
        NOM: "Îles Malouines (Îles Falkland)",
        VILLE: "Port Stanley",
    },
    {
        CODE: "MP",
        NOM: "Îles Mariannes du Nord",
        VILLE: "Saipan",
    },
    {
        CODE: "MH",
        NOM: "Îles Marshall",
        VILLE: "Majuro",
    },
    {
        CODE: "UM",
        NOM: "Îles mineures éloignées des États-Unis",
        VILLE: "Johnston Atoll",
    },
    {
        CODE: "PN",
        NOM: "Îles Pitcairn",
        VILLE: "Adamstown",
    },
    {
        CODE: "SB",
        NOM: "Îles Salomon",
        VILLE: "Honiara",
    },
    {
        CODE: "TC",
        NOM: "Îles Turques-et-Caïques",
        VILLE: "Cockburn Town",
    },
    {
        CODE: "VG",
        NOM: "Îles Vierges britanniques",
        VILLE: "Road Town",
    },
    {
        CODE: "VI",
        NOM: "Îles Vierges des États-Unis",
        VILLE: "Charlotte Amalie",
    },
    {
        CODE: "IN",
        NOM: "Inde",
        VILLE: "Delhi",
    },
    {
        CODE: "ID",
        NOM: "Indonésie",
        VILLE: "Bali",
    },
    {
        CODE: "IQ",
        NOM: "Irak",
        VILLE: "Bagdad",
    },
    {
        CODE: "IR",
        NOM: "Iran",
        VILLE: "Ispahan",
    },
    {
        CODE: "IE",
        NOM: "Irlande",
        VILLE: "Dublin",
    },
    {
        CODE: "IS",
        NOM: "Islande",
        VILLE: "Reykjavik",
    },
    {
        CODE: "IL",
        NOM: "Israël",
        VILLE: "Jérusalem",
    },
    {
        CODE: "IT",
        NOM: "Italie",
        VILLE: "Rome",
    },
    {
        CODE: "JM",
        NOM: "Jamaïque",
        VILLE: "Montego Bay",
    },
    {
        CODE: "JP",
        NOM: "Japon",
        VILLE: "Tokyo",
    },
    {
        CODE: "JE",
        NOM: "Jersey",
        VILLE: "Saint-Hélier",
    },
    {
        CODE: "JO",
        NOM: "Jordanie",
        VILLE: "Pétra",
    },
    {
        CODE: "KZ",
        NOM: "Kazakhstan",
        VILLE: "Almaty",
    },
    {
        CODE: "KE",
        NOM: "Kenya",
        VILLE: "Nairobi",
    },
    {
        CODE: "KG",
        NOM: "Kirghizstan",
        VILLE: "Bichkek",
    },
    {
        CODE: "KI",
        NOM: "Kiribati",
        VILLE: "Tarawa-Sud",
    },
    {
        CODE: "XK",
        NOM: "Kosovo",
        VILLE: "Pristina",
    },
    {
        CODE: "KW",
        NOM: "Koweït",
        VILLE: "Koweît City",
    },
    {
        CODE: "RE",
        NOM: "La Réunion",
        VILLE: "Saint-Denis",
    },
    {
        CODE: "LA",
        NOM: "Laos",
        VILLE: "Luang Prabang",
    },
    {
        CODE: "LS",
        NOM: "Lesotho",
        VILLE: "Maseru",
    },
    {
        CODE: "LV",
        NOM: "Lettonie",
        VILLE: "Riga",
    },
    {
        CODE: "LB",
        NOM: "Liban",
        VILLE: "Beyrouth",
    },
    {
        CODE: "LR",
        NOM: "Liberia",
        VILLE: "Monrovia",
    },
    {
        CODE: "LY",
        NOM: "Libye",
        VILLE: "Tripoli",
    },
    {
        CODE: "LI",
        NOM: "Liechtenstein",
        VILLE: "Vaduz",
    },
    {
        CODE: "LT",
        NOM: "Lituanie",
        VILLE: "Vilnius",
    },
    {
        CODE: "LU",
        NOM: "Luxembourg",
        VILLE: "Luxembourg-Ville",
    },
    {
        CODE: "MO",
        NOM: "Macao",
        VILLE: "Macao",
    },
    {
        CODE: "MK",
        NOM: "Macédoine du Nord",
        VILLE: "Ohrid",
    },
    {
        CODE: "MG",
        NOM: "Madagascar",
        VILLE: "Nosy Be",
    },
    {
        CODE: "MY",
        NOM: "Malaisie",
        VILLE: "Kuala Lumpur",
    },
    {
        CODE: "MW",
        NOM: "Malawi",
        VILLE: "Lilongwe",
    },
    {
        CODE: "MV",
        NOM: "Maldives",
        VILLE: "Malé",
    },
    {
        CODE: "ML",
        NOM: "Mali",
        VILLE: "Bamako",
    },
    {
        CODE: "MT",
        NOM: "Malte",
        VILLE: "La Valette",
    },
    {
        CODE: "MA",
        NOM: "Maroc",
        VILLE: "Marrakech",
    },
    {
        CODE: "MQ",
        NOM: "Martinique",
        VILLE: "Fort-de-France",
    },
    {
        CODE: "MU",
        NOM: "Maurice",
        VILLE: "Port-Louis",
    },
    {
        CODE: "MR",
        NOM: "Mauritanie",
        VILLE: "Nouakchott",
    },
    {
        CODE: "YT",
        NOM: "Mayotte",
        VILLE: "Mamoudzou",
    },
    {
        CODE: "MX",
        NOM: "Mexique",
        VILLE: "Mexico",
    },
    {
        CODE: "FM",
        NOM: "Micronésie",
        VILLE: "Kolonia",
    },
    {
        CODE: "MD",
        NOM: "Moldavie",
        VILLE: "Chișinău",
    },
    {
        CODE: "MC",
        NOM: "Monaco",
        VILLE: "Monte-Carlo",
    },
    {
        CODE: "MN",
        NOM: "Mongolie",
        VILLE: "Oulan-Bator",
    },
    {
        CODE: "ME",
        NOM: "Monténégro",
        VILLE: "Kotor",
    },
    {
        CODE: "MS",
        NOM: "Montserrat",
        VILLE: "Plymouth",
    },
    {
        CODE: "MZ",
        NOM: "Mozambique",
        VILLE: "Maputo",
    },
    {
        CODE: "MM",
        NOM: "Myanmar (Birmanie)",
        VILLE: "Bagan",
    },
    {
        CODE: "NA",
        NOM: "Namibie",
        VILLE: "Windhoek",
    },
    {
        CODE: "NR",
        NOM: "Nauru",
        VILLE: "Yaren",
    },
    {
        CODE: "NP",
        NOM: "Népal",
        VILLE: "Katmandou",
    },
    {
        CODE: "NI",
        NOM: "Nicaragua",
        VILLE: "Managua",
    },
    {
        CODE: "NE",
        NOM: "Niger",
        VILLE: "Niamey",
    },
    {
        CODE: "NG",
        NOM: "Nigeria",
        VILLE: "Lagos",
    },
    {
        CODE: "NU",
        NOM: "Niue",
        VILLE: "Alofi",
    },
    {
        CODE: "NO",
        NOM: "Norvège",
        VILLE: "Oslo",
    },
    {
        CODE: "NC",
        NOM: "Nouvelle-Calédonie",
        VILLE: "Nouméa",
    },
    {
        CODE: "NZ",
        NOM: "Nouvelle-Zélande",
        VILLE: "Auckland",
    },
    {
        CODE: "OM",
        NOM: "Oman",
        VILLE: "Mascate",
    },
    {
        CODE: "UG",
        NOM: "Ouganda",
        VILLE: "Kampala",
    },
    {
        CODE: "UZ",
        NOM: "Ouzbékistan",
        VILLE: "Tachkent",
    },
    {
        CODE: "PK",
        NOM: "Pakistan",
        VILLE: "Karachi",
    },
    {
        CODE: "PW",
        NOM: "Palaos",
        VILLE: "Ngerulmud",
    },
    {
        CODE: "PS",
        NOM: "Palestine",
        VILLE: "Bethléem",
    },
    {
        CODE: "PA",
        NOM: "Panama",
        VILLE: "Panama",
    },
    {
        CODE: "PG",
        NOM: "Papouasie-Nouvelle-Guinée",
        VILLE: "Port Moresby",
    },
    {
        CODE: "PY",
        NOM: "Paraguay",
        VILLE: "Asuncion",
    },
    {
        CODE: "NL",
        NOM: "Pays-Bas",
        VILLE: "Amsterdam",
    },
    {
        CODE: "BQ",
        NOM: "Pays-Bas caribéens",
        VILLE: "Willemstad",
    },
    {
        CODE: "PE",
        NOM: "Pérou",
        VILLE: "Lima",
    },
    {
        CODE: "PH",
        NOM: "Philippines",
        VILLE: "Manille",
    },
    {
        CODE: "PL",
        NOM: "Pologne",
        VILLE: "Varsovie",
    },
    {
        CODE: "PF",
        NOM: "Polynésie française",
        VILLE: "Papeete",
    },
    {
        CODE: "PR",
        NOM: "Porto Rico",
        VILLE: "San Juan",
    },
    {
        CODE: "PT",
        NOM: "Portugal",
        VILLE: "Lisbonne",
    },
    {
        CODE: "QA",
        NOM: "Qatar",
        VILLE: "Doha",
    },
    {
        CODE: "CF",
        NOM: "République centrafricaine",
        VILLE: "Bangui",
    },
    {
        CODE: "DO",
        NOM: "République dominicaine",
        VILLE: "Punta Cana",
    },
    {
        CODE: "RO",
        NOM: "Roumanie",
        VILLE: "Bucarest",
    },
    {
        CODE: "GB",
        NOM: "Royaume-Uni",
        VILLE: "Londres",
    },
    {
        CODE: "RU",
        NOM: "Russie",
        VILLE: "Moscou",
    },
    {
        CODE: "RW",
        NOM: "Rwanda",
        VILLE: "Kigali",
    },
    {
        CODE: "EH",
        NOM: "Sahara occidental",
        VILLE: "Dakhla",
    },
    {
        CODE: "BL",
        NOM: "Saint-Barthélemy",
        VILLE: "Gustavia",
    },
    {
        CODE: "KN",
        NOM: "Saint-Christophe-et-Niévès",
        VILLE: "Basseterre",
    },
    {
        CODE: "SM",
        NOM: "Saint-Marin",
        VILLE: "Saint-Marin",
    },
    {
        CODE: "MF",
        NOM: "Saint-Martin",
        VILLE: "Philipsburg",
    },
    {
        CODE: "SX",
        NOM: "Saint-Martin (partie néerlandaise)",
        VILLE: "Marigot",
    },
    {
        CODE: "PM",
        NOM: "Saint-Pierre-et-Miquelon",
        VILLE: "Saint-Pierre",
    },
    {
        CODE: "VC",
        NOM: "Saint-Vincent-et-les Grenadines",
        VILLE: "Kingstown",
    },
    {
        CODE: "SH",
        NOM: "Sainte-Hélène",
        VILLE: "Jamestown",
    },
    {
        CODE: "LC",
        NOM: "Sainte-Lucie",
        VILLE: "Gros Islet",
    },
    {
        CODE: "SV",
        NOM: "Salvador",
        VILLE: "San Salvador",
    },
    {
        CODE: "WS",
        NOM: "Samoa",
        VILLE: "Apia",
    },
    {
        CODE: "AS",
        NOM: "Samoa américaines",
        VILLE: "Pago Pago",
    },
    {
        CODE: "ST",
        NOM: "Sao Tomé-et-Principe",
        VILLE: "São Tomé",
    },
    {
        CODE: "SN",
        NOM: "Sénégal",
        VILLE: "Dakar",
    },
    {
        CODE: "RS",
        NOM: "Serbie",
        VILLE: "Belgrade",
    },
    {
        CODE: "SC",
        NOM: "Seychelles",
        VILLE: "Victoria",
    },
    {
        CODE: "SL",
        NOM: "Sierra Leone",
        VILLE: "Freetown",
    },
    {
        CODE: "SG",
        NOM: "Singapour",
        VILLE: "Singapour",
    },
    {
        CODE: "SK",
        NOM: "Slovaquie",
        VILLE: "Bratislava",
    },
    {
        CODE: "SI",
        NOM: "Slovénie",
        VILLE: "Ljubljana",
    },
    {
        CODE: "SO",
        NOM: "Somalie",
        VILLE: "Mogadiscio",
    },
    {
        CODE: "SD",
        NOM: "Soudan",
        VILLE: "Khartoum",
    },
    {
        CODE: "SS",
        NOM: "Soudan du Sud",
        VILLE: "Juba",
    },
    {
        CODE: "LK",
        NOM: "Sri Lanka",
        VILLE: "Colombo",
    },
    {
        CODE: "SE",
        NOM: "Suède",
        VILLE: "Stockholm",
    },
    {
        CODE: "CH",
        NOM: "Suisse",
        VILLE: "Zurich",
    },
    {
        CODE: "SR",
        NOM: "Suriname",
        VILLE: "Paramaribo",
    },
    {
        CODE: "SJ",
        NOM: "Svalbard et Jan Mayen",
        VILLE: "Longyearbyen",
    },
    {
        CODE: "SY",
        NOM: "Syrie",
        VILLE: "Damas",
    },
    {
        CODE: "TJ",
        NOM: "Tadjikistan",
        VILLE: "Douchanbé",
    },
    {
        CODE: "TW",
        NOM: "Taïwan",
        VILLE: "Taipei",
    },
    {
        CODE: "TZ",
        NOM: "Tanzanie",
        VILLE: "Dar es Salaam",
    },
    {
        CODE: "TD",
        NOM: "Tchad",
        VILLE: "N'Djaména",
    },
    {
        CODE: "CZ",
        NOM: "Tchéquie",
        VILLE: "Prague",
    },
    {
        CODE: "TF",
        NOM: "Terres australes françaises",
        VILLE: "Port-aux-Français",
    },
    {
        CODE: "IO",
        NOM: "Territoire britannique de l'océan Indien",
        VILLE: "Diego Garcia",
    },
    {
        CODE: "TH",
        NOM: "Thaïlande",
        VILLE: "Bangkok",
    },
    {
        CODE: "TL",
        NOM: "Timor oriental",
        VILLE: "Dili",
    },
    {
        CODE: "TG",
        NOM: "Togo",
        VILLE: "Lomé",
    },
    {
        CODE: "TK",
        NOM: "Tokelau",
        VILLE: "Fakaofo",
    },
    {
        CODE: "TO",
        NOM: "Tonga",
        VILLE: "Nuku'alofa",
    },
    {
        CODE: "TT",
        NOM: "Trinité-et-Tobago",
        VILLE: "Port of Spain",
    },
    {
        CODE: "TN",
        NOM: "Tunisie",
        VILLE: "Tunis",
    },
    {
        CODE: "TM",
        NOM: "Turkménistan",
        VILLE: "Achgabat",
    },
    {
        CODE: "TR",
        NOM: "Turquie",
        VILLE: "Istanbul",
    },
    {
        CODE: "TV",
        NOM: "Tuvalu",
        VILLE: "Funafuti",
    },
    {
        CODE: "UA",
        NOM: "Ukraine",
        VILLE: "Kyiv",
    },
    {
        CODE: "UY",
        NOM: "Uruguay",
        VILLE: "Montevideo",
    },
    {
        CODE: "VU",
        NOM: "Vanuatu",
        VILLE: "Port-Vila",
    },
    {
        CODE: "VE",
        NOM: "Venezuela",
        VILLE: "Caracas",
    },
    {
        CODE: "VN",
        NOM: "Viêt Nam",
        VILLE: "Hanoï",
    },
    {
        CODE: "WF",
        NOM: "Wallis-et-Futuna",
        VILLE: "Mata-Utu",
    },
    {
        CODE: "YE",
        NOM: "Yémen",
        VILLE: "Sanaa",
    },
    {
        CODE: "ZM",
        NOM: "Zambie",
        VILLE: "Lusaka",
    },
    {
        CODE: "ZW",
        NOM: "Zimbabwe",
        VILLE: "Harare",
    },
];

export default pays;
