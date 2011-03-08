var isoCountry = {

	data : [{"name":"Afghanistan","alpha2":"AF","alpha3":"AFG","numeric":"004","ISO31662":"ISO 3166-2:AF"},{"name":"\u00c5land Islands","alpha2":"AX","alpha3":"ALA","numeric":"248","ISO31662":"ISO 3166-2:AX"},{"name":"Albania","alpha2":"AL","alpha3":"ALB","numeric":"008","ISO31662":"ISO 3166-2:AL"},{"name":"Algeria","alpha2":"DZ","alpha3":"DZA","numeric":"012","ISO31662":"ISO 3166-2:DZ"},{"name":"American Samoa","alpha2":"AS","alpha3":"ASM","numeric":"016","ISO31662":"ISO 3166-2:AS"},{"name":"Andorra","alpha2":"AD","alpha3":"AND","numeric":"020","ISO31662":"ISO 3166-2:AD"},{"name":"Angola","alpha2":"AO","alpha3":"AGO","numeric":"024","ISO31662":"ISO 3166-2:AO"},{"name":"Anguilla","alpha2":"AI","alpha3":"AIA","numeric":"660","ISO31662":"ISO 3166-2:AI"},{"name":"Antarctica","alpha2":"AQ","alpha3":"ATA","numeric":"010","ISO31662":"ISO 3166-2:AQ"},{"name":"Antigua and Barbuda","alpha2":"AG","alpha3":"ATG","numeric":"028","ISO31662":"ISO 3166-2:AG"},{"name":"Argentina","alpha2":"AR","alpha3":"ARG","numeric":"032","ISO31662":"ISO 3166-2:AR"},{"name":"Armenia","alpha2":"AM","alpha3":"ARM","numeric":"051","ISO31662":"ISO 3166-2:AM"},{"name":"Aruba","alpha2":"AW","alpha3":"ABW","numeric":"533","ISO31662":"ISO 3166-2:AW"},{"name":"Australia","alpha2":"AU","alpha3":"AUS","numeric":"036","ISO31662":"ISO 3166-2:AU"},{"name":"Austria","alpha2":"AT","alpha3":"AUT","numeric":"040","ISO31662":"ISO 3166-2:AT"},{"name":"Azerbaijan","alpha2":"AZ","alpha3":"AZE","numeric":"031","ISO31662":"ISO 3166-2:AZ"},{"name":"Bahamas","alpha2":"BS","alpha3":"BHS","numeric":"044","ISO31662":"ISO 3166-2:BS"},{"name":"Bahrain","alpha2":"BH","alpha3":"BHR","numeric":"048","ISO31662":"ISO 3166-2:BH"},{"name":"Bangladesh","alpha2":"BD","alpha3":"BGD","numeric":"050","ISO31662":"ISO 3166-2:BD"},{"name":"Barbados","alpha2":"BB","alpha3":"BRB","numeric":"052","ISO31662":"ISO 3166-2:BB"},{"name":"Belarus","alpha2":"BY","alpha3":"BLR","numeric":"112","ISO31662":"ISO 3166-2:BY"},{"name":"Belgium","alpha2":"BE","alpha3":"BEL","numeric":"056","ISO31662":"ISO 3166-2:BE"},{"name":"Belize","alpha2":"BZ","alpha3":"BLZ","numeric":"084","ISO31662":"ISO 3166-2:BZ"},{"name":"Benin","alpha2":"BJ","alpha3":"BEN","numeric":"204","ISO31662":"ISO 3166-2:BJ"},{"name":"Bermuda","alpha2":"BM","alpha3":"BMU","numeric":"060","ISO31662":"ISO 3166-2:BM"},{"name":"Bhutan","alpha2":"BT","alpha3":"BTN","numeric":"064","ISO31662":"ISO 3166-2:BT"},{"name":"Bolivia, Plurinational State of","alpha2":"BO","alpha3":"BOL","numeric":"068","ISO31662":"ISO 3166-2:BO"},{"name":"Bosnia and Herzegovina","alpha2":"BA","alpha3":"BIH","numeric":"070","ISO31662":"ISO 3166-2:BA"},{"name":"Botswana","alpha2":"BW","alpha3":"BWA","numeric":"072","ISO31662":"ISO 3166-2:BW"},{"name":"Bouvet Island","alpha2":"BV","alpha3":"BVT","numeric":"074","ISO31662":"ISO 3166-2:BV"},{"name":"Brazil","alpha2":"BR","alpha3":"BRA","numeric":"076","ISO31662":"ISO 3166-2:BR"},{"name":"British Indian Ocean Territory","alpha2":"IO","alpha3":"IOT","numeric":"086","ISO31662":"ISO 3166-2:IO"},{"name":"Brunei Darussalam","alpha2":"BN","alpha3":"BRN","numeric":"096","ISO31662":"ISO 3166-2:BN"},{"name":"Bulgaria","alpha2":"BG","alpha3":"BGR","numeric":"100","ISO31662":"ISO 3166-2:BG"},{"name":"Burkina Faso","alpha2":"BF","alpha3":"BFA","numeric":"854","ISO31662":"ISO 3166-2:BF"},{"name":"Burundi","alpha2":"BI","alpha3":"BDI","numeric":"108","ISO31662":"ISO 3166-2:BI"},{"name":"Cambodia","alpha2":"KH","alpha3":"KHM","numeric":"116","ISO31662":"ISO 3166-2:KH"},{"name":"Cameroon","alpha2":"CM","alpha3":"CMR","numeric":"120","ISO31662":"ISO 3166-2:CM"},{"name":"Canada","alpha2":"CA","alpha3":"CAN","numeric":"124","ISO31662":"ISO 3166-2:CA"},{"name":"Cape Verde","alpha2":"CV","alpha3":"CPV","numeric":"132","ISO31662":"ISO 3166-2:CV"},{"name":"Cayman Islands","alpha2":"KY","alpha3":"CYM","numeric":"136","ISO31662":"ISO 3166-2:KY"},{"name":"Central African Republic","alpha2":"CF","alpha3":"CAF","numeric":"140","ISO31662":"ISO 3166-2:CF"},{"name":"Chad","alpha2":"TD","alpha3":"TCD","numeric":"148","ISO31662":"ISO 3166-2:TD"},{"name":"Chile","alpha2":"CL","alpha3":"CHL","numeric":"152","ISO31662":"ISO 3166-2:CL"},{"name":"China","alpha2":"CN","alpha3":"CHN","numeric":"156","ISO31662":"ISO 3166-2:CN"},{"name":"Christmas Island","alpha2":"CX","alpha3":"CXR","numeric":"162","ISO31662":"ISO 3166-2:CX"},{"name":"Cocos (Keeling) Islands","alpha2":"CC","alpha3":"CCK","numeric":"166","ISO31662":"ISO 3166-2:CC"},{"name":"Colombia","alpha2":"CO","alpha3":"COL","numeric":"170","ISO31662":"ISO 3166-2:CO"},{"name":"Comoros","alpha2":"KM","alpha3":"COM","numeric":"174","ISO31662":"ISO 3166-2:KM"},{"name":"Congo","alpha2":"CG","alpha3":"COG","numeric":"178","ISO31662":"ISO 3166-2:CG"},{"name":"Congo, the Democratic Republic of the","alpha2":"CD","alpha3":"COD","numeric":"180","ISO31662":"ISO 3166-2:CD"},{"name":"Cook Islands","alpha2":"CK","alpha3":"COK","numeric":"184","ISO31662":"ISO 3166-2:CK"},{"name":"Costa Rica","alpha2":"CR","alpha3":"CRI","numeric":"188","ISO31662":"ISO 3166-2:CR"},{"name":"C\u00f4te d'Ivoire","alpha2":"CI","alpha3":"CIV","numeric":"384","ISO31662":"ISO 3166-2:CI"},{"name":"Croatia","alpha2":"HR","alpha3":"HRV","numeric":"191","ISO31662":"ISO 3166-2:HR"},{"name":"Cuba","alpha2":"CU","alpha3":"CUB","numeric":"192","ISO31662":"ISO 3166-2:CU"},{"name":"Cyprus","alpha2":"CY","alpha3":"CYP","numeric":"196","ISO31662":"ISO 3166-2:CY"},{"name":"Czech Republic","alpha2":"CZ","alpha3":"CZE","numeric":"203","ISO31662":"ISO 3166-2:CZ"},{"name":"Denmark","alpha2":"DK","alpha3":"DNK","numeric":"208","ISO31662":"ISO 3166-2:DK"},{"name":"Djibouti","alpha2":"DJ","alpha3":"DJI","numeric":"262","ISO31662":"ISO 3166-2:DJ"},{"name":"Dominica","alpha2":"DM","alpha3":"DMA","numeric":"212","ISO31662":"ISO 3166-2:DM"},{"name":"Dominican Republic","alpha2":"DO","alpha3":"DOM","numeric":"214","ISO31662":"ISO 3166-2:DO"},{"name":"Ecuador","alpha2":"EC","alpha3":"ECU","numeric":"218","ISO31662":"ISO 3166-2:EC"},{"name":"Egypt","alpha2":"EG","alpha3":"EGY","numeric":"818","ISO31662":"ISO 3166-2:EG"},{"name":"El Salvador","alpha2":"SV","alpha3":"SLV","numeric":"222","ISO31662":"ISO 3166-2:SV"},{"name":"Equatorial Guinea","alpha2":"GQ","alpha3":"GNQ","numeric":"226","ISO31662":"ISO 3166-2:GQ"},{"name":"Eritrea","alpha2":"ER","alpha3":"ERI","numeric":"232","ISO31662":"ISO 3166-2:ER"},{"name":"Estonia","alpha2":"EE","alpha3":"EST","numeric":"233","ISO31662":"ISO 3166-2:EE"},{"name":"Ethiopia","alpha2":"ET","alpha3":"ETH","numeric":"231","ISO31662":"ISO 3166-2:ET"},{"name":"Falkland Islands (Malvinas)","alpha2":"FK","alpha3":"FLK","numeric":"238","ISO31662":"ISO 3166-2:FK"},{"name":"Faroe Islands","alpha2":"FO","alpha3":"FRO","numeric":"234","ISO31662":"ISO 3166-2:FO"},{"name":"Fiji","alpha2":"FJ","alpha3":"FJI","numeric":"242","ISO31662":"ISO 3166-2:FJ"},{"name":"Finland","alpha2":"FI","alpha3":"FIN","numeric":"246","ISO31662":"ISO 3166-2:FI"},{"name":"France","alpha2":"FR","alpha3":"FRA","numeric":"250","ISO31662":"ISO 3166-2:FR"},{"name":"French Guiana","alpha2":"GF","alpha3":"GUF","numeric":"254","ISO31662":"ISO 3166-2:GF"},{"name":"French Polynesia","alpha2":"PF","alpha3":"PYF","numeric":"258","ISO31662":"ISO 3166-2:PF"},{"name":"French Southern Territories","alpha2":"TF","alpha3":"ATF","numeric":"260","ISO31662":"ISO 3166-2:TF"},{"name":"Gabon","alpha2":"GA","alpha3":"GAB","numeric":"266","ISO31662":"ISO 3166-2:GA"},{"name":"Gambia","alpha2":"GM","alpha3":"GMB","numeric":"270","ISO31662":"ISO 3166-2:GM"},{"name":"Georgia","alpha2":"GE","alpha3":"GEO","numeric":"268","ISO31662":"ISO 3166-2:GE"},{"name":"Germany","alpha2":"DE","alpha3":"DEU","numeric":"276","ISO31662":"ISO 3166-2:DE"},{"name":"Ghana","alpha2":"GH","alpha3":"GHA","numeric":"288","ISO31662":"ISO 3166-2:GH"},{"name":"Gibraltar","alpha2":"GI","alpha3":"GIB","numeric":"292","ISO31662":"ISO 3166-2:GI"},{"name":"Greece","alpha2":"GR","alpha3":"GRC","numeric":"300","ISO31662":"ISO 3166-2:GR"},{"name":"Greenland","alpha2":"GL","alpha3":"GRL","numeric":"304","ISO31662":"ISO 3166-2:GL"},{"name":"Grenada","alpha2":"GD","alpha3":"GRD","numeric":"308","ISO31662":"ISO 3166-2:GD"},{"name":"Guadeloupe","alpha2":"GP","alpha3":"GLP","numeric":"312","ISO31662":"ISO 3166-2:GP"},{"name":"Guam","alpha2":"GU","alpha3":"GUM","numeric":"316","ISO31662":"ISO 3166-2:GU"},{"name":"Guatemala","alpha2":"GT","alpha3":"GTM","numeric":"320","ISO31662":"ISO 3166-2:GT"},{"name":"Guernsey","alpha2":"GG","alpha3":"GGY","numeric":"831","ISO31662":"ISO 3166-2:GG"},{"name":"Guinea","alpha2":"GN","alpha3":"GIN","numeric":"324","ISO31662":"ISO 3166-2:GN"},{"name":"Guinea-Bissau","alpha2":"GW","alpha3":"GNB","numeric":"624","ISO31662":"ISO 3166-2:GW"},{"name":"Guyana","alpha2":"GY","alpha3":"GUY","numeric":"328","ISO31662":"ISO 3166-2:GY"},{"name":"Haiti","alpha2":"HT","alpha3":"HTI","numeric":"332","ISO31662":"ISO 3166-2:HT"},{"name":"Heard Island and McDonald Islands","alpha2":"HM","alpha3":"HMD","numeric":"334","ISO31662":"ISO 3166-2:HM"},{"name":"Holy See (Vatican City State)","alpha2":"VA","alpha3":"VAT","numeric":"336","ISO31662":"ISO 3166-2:VA"},{"name":"Honduras","alpha2":"HN","alpha3":"HND","numeric":"340","ISO31662":"ISO 3166-2:HN"},{"name":"Hong Kong","alpha2":"HK","alpha3":"HKG","numeric":"344","ISO31662":"ISO 3166-2:HK"},{"name":"Hungary","alpha2":"HU","alpha3":"HUN","numeric":"348","ISO31662":"ISO 3166-2:HU"},{"name":"Iceland","alpha2":"IS","alpha3":"ISL","numeric":"352","ISO31662":"ISO 3166-2:IS"},{"name":"India","alpha2":"IN","alpha3":"IND","numeric":"356","ISO31662":"ISO 3166-2:IN"},{"name":"Indonesia","alpha2":"ID","alpha3":"IDN","numeric":"360","ISO31662":"ISO 3166-2:ID"},{"name":"Iran, Islamic Republic of","alpha2":"IR","alpha3":"IRN","numeric":"364","ISO31662":"ISO 3166-2:IR"},{"name":"Iraq","alpha2":"IQ","alpha3":"IRQ","numeric":"368","ISO31662":"ISO 3166-2:IQ"},{"name":"Ireland","alpha2":"IE","alpha3":"IRL","numeric":"372","ISO31662":"ISO 3166-2:IE"},{"name":"Isle of Man","alpha2":"IM","alpha3":"IMN","numeric":"833","ISO31662":"ISO 3166-2:IM"},{"name":"Israel","alpha2":"IL","alpha3":"ISR","numeric":"376","ISO31662":"ISO 3166-2:IL"},{"name":"Italy","alpha2":"IT","alpha3":"ITA","numeric":"380","ISO31662":"ISO 3166-2:IT"},{"name":"Jamaica","alpha2":"JM","alpha3":"JAM","numeric":"388","ISO31662":"ISO 3166-2:JM"},{"name":"Japan","alpha2":"JP","alpha3":"JPN","numeric":"392","ISO31662":"ISO 3166-2:JP"},{"name":"Jersey","alpha2":"JE","alpha3":"JEY","numeric":"832","ISO31662":"ISO 3166-2:JE"},{"name":"Jordan","alpha2":"JO","alpha3":"JOR","numeric":"400","ISO31662":"ISO 3166-2:JO"},{"name":"Kazakhstan","alpha2":"KZ","alpha3":"KAZ","numeric":"398","ISO31662":"ISO 3166-2:KZ"},{"name":"Kenya","alpha2":"KE","alpha3":"KEN","numeric":"404","ISO31662":"ISO 3166-2:KE"},{"name":"Kiribati","alpha2":"KI","alpha3":"KIR","numeric":"296","ISO31662":"ISO 3166-2:KI"},{"name":"Korea, Democratic People's Republic of","alpha2":"KP","alpha3":"PRK","numeric":"408","ISO31662":"ISO 3166-2:KP"},{"name":"Korea, Republic of","alpha2":"KR","alpha3":"KOR","numeric":"410","ISO31662":"ISO 3166-2:KR"},{"name":"Kuwait","alpha2":"KW","alpha3":"KWT","numeric":"414","ISO31662":"ISO 3166-2:KW"},{"name":"Kyrgyzstan","alpha2":"KG","alpha3":"KGZ","numeric":"417","ISO31662":"ISO 3166-2:KG"},{"name":"Lao People's Democratic Republic","alpha2":"LA","alpha3":"LAO","numeric":"418","ISO31662":"ISO 3166-2:LA"},{"name":"Latvia","alpha2":"LV","alpha3":"LVA","numeric":"428","ISO31662":"ISO 3166-2:LV"},{"name":"Lebanon","alpha2":"LB","alpha3":"LBN","numeric":"422","ISO31662":"ISO 3166-2:LB"},{"name":"Lesotho","alpha2":"LS","alpha3":"LSO","numeric":"426","ISO31662":"ISO 3166-2:LS"},{"name":"Liberia","alpha2":"LR","alpha3":"LBR","numeric":"430","ISO31662":"ISO 3166-2:LR"},{"name":"Libyan Arab Jamahiriya","alpha2":"LY","alpha3":"LBY","numeric":"434","ISO31662":"ISO 3166-2:LY"},{"name":"Liechtenstein","alpha2":"LI","alpha3":"LIE","numeric":"438","ISO31662":"ISO 3166-2:LI"},{"name":"Lithuania","alpha2":"LT","alpha3":"LTU","numeric":"440","ISO31662":"ISO 3166-2:LT"},{"name":"Luxembourg","alpha2":"LU","alpha3":"LUX","numeric":"442","ISO31662":"ISO 3166-2:LU"},{"name":"Macao","alpha2":"MO","alpha3":"MAC","numeric":"446","ISO31662":"ISO 3166-2:MO"},{"name":"Macedonia, the former Yugoslav Republic of","alpha2":"MK","alpha3":"MKD","numeric":"807","ISO31662":"ISO 3166-2:MK"},{"name":"Madagascar","alpha2":"MG","alpha3":"MDG","numeric":"450","ISO31662":"ISO 3166-2:MG"},{"name":"Malawi","alpha2":"MW","alpha3":"MWI","numeric":"454","ISO31662":"ISO 3166-2:MW"},{"name":"Malaysia","alpha2":"MY","alpha3":"MYS","numeric":"458","ISO31662":"ISO 3166-2:MY"},{"name":"Maldives","alpha2":"MV","alpha3":"MDV","numeric":"462","ISO31662":"ISO 3166-2:MV"},{"name":"Mali","alpha2":"ML","alpha3":"MLI","numeric":"466","ISO31662":"ISO 3166-2:ML"},{"name":"Malta","alpha2":"MT","alpha3":"MLT","numeric":"470","ISO31662":"ISO 3166-2:MT"},{"name":"Marshall Islands","alpha2":"MH","alpha3":"MHL","numeric":"584","ISO31662":"ISO 3166-2:MH"},{"name":"Martinique","alpha2":"MQ","alpha3":"MTQ","numeric":"474","ISO31662":"ISO 3166-2:MQ"},{"name":"Mauritania","alpha2":"MR","alpha3":"MRT","numeric":"478","ISO31662":"ISO 3166-2:MR"},{"name":"Mauritius","alpha2":"MU","alpha3":"MUS","numeric":"480","ISO31662":"ISO 3166-2:MU"},{"name":"Mayotte","alpha2":"YT","alpha3":"MYT","numeric":"175","ISO31662":"ISO 3166-2:YT"},{"name":"Mexico","alpha2":"MX","alpha3":"MEX","numeric":"484","ISO31662":"ISO 3166-2:MX"},{"name":"Micronesia, Federated States of","alpha2":"FM","alpha3":"FSM","numeric":"583","ISO31662":"ISO 3166-2:FM"},{"name":"Moldova, Republic of","alpha2":"MD","alpha3":"MDA","numeric":"498","ISO31662":"ISO 3166-2:MD"},{"name":"Monaco","alpha2":"MC","alpha3":"MCO","numeric":"492","ISO31662":"ISO 3166-2:MC"},{"name":"Mongolia","alpha2":"MN","alpha3":"MNG","numeric":"496","ISO31662":"ISO 3166-2:MN"},{"name":"Montenegro","alpha2":"ME","alpha3":"MNE","numeric":"499","ISO31662":"ISO 3166-2:ME"},{"name":"Montserrat","alpha2":"MS","alpha3":"MSR","numeric":"500","ISO31662":"ISO 3166-2:MS"},{"name":"Morocco","alpha2":"MA","alpha3":"MAR","numeric":"504","ISO31662":"ISO 3166-2:MA"},{"name":"Mozambique","alpha2":"MZ","alpha3":"MOZ","numeric":"508","ISO31662":"ISO 3166-2:MZ"},{"name":"Myanmar","alpha2":"MM","alpha3":"MMR","numeric":"104","ISO31662":"ISO 3166-2:MM"},{"name":"Namibia","alpha2":"NA","alpha3":"NAM","numeric":"516","ISO31662":"ISO 3166-2:NA"},{"name":"Nauru","alpha2":"NR","alpha3":"NRU","numeric":"520","ISO31662":"ISO 3166-2:NR"},{"name":"Nepal","alpha2":"NP","alpha3":"NPL","numeric":"524","ISO31662":"ISO 3166-2:NP"},{"name":"Netherlands","alpha2":"NL","alpha3":"NLD","numeric":"528","ISO31662":"ISO 3166-2:NL"},{"name":"Netherlands Antilles","alpha2":"AN","alpha3":"ANT","numeric":"530","ISO31662":"ISO 3166-2:AN"},{"name":"New Caledonia","alpha2":"NC","alpha3":"NCL","numeric":"540","ISO31662":"ISO 3166-2:NC"},{"name":"New Zealand","alpha2":"NZ","alpha3":"NZL","numeric":"554","ISO31662":"ISO 3166-2:NZ"},{"name":"Nicaragua","alpha2":"NI","alpha3":"NIC","numeric":"558","ISO31662":"ISO 3166-2:NI"},{"name":"Niger","alpha2":"NE","alpha3":"NER","numeric":"562","ISO31662":"ISO 3166-2:NE"},{"name":"Nigeria","alpha2":"NG","alpha3":"NGA","numeric":"566","ISO31662":"ISO 3166-2:NG"},{"name":"Niue","alpha2":"NU","alpha3":"NIU","numeric":"570","ISO31662":"ISO 3166-2:NU"},{"name":"Norfolk Island","alpha2":"NF","alpha3":"NFK","numeric":"574","ISO31662":"ISO 3166-2:NF"},{"name":"Northern Mariana Islands","alpha2":"MP","alpha3":"MNP","numeric":"580","ISO31662":"ISO 3166-2:MP"},{"name":"Norway","alpha2":"NO","alpha3":"NOR","numeric":"578","ISO31662":"ISO 3166-2:NO"},{"name":"Oman","alpha2":"OM","alpha3":"OMN","numeric":"512","ISO31662":"ISO 3166-2:OM"},{"name":"Pakistan","alpha2":"PK","alpha3":"PAK","numeric":"586","ISO31662":"ISO 3166-2:PK"},{"name":"Palau","alpha2":"PW","alpha3":"PLW","numeric":"585","ISO31662":"ISO 3166-2:PW"},{"name":"Palestinian Territory, Occupied","alpha2":"PS","alpha3":"PSE","numeric":"275","ISO31662":"ISO 3166-2:PS"},{"name":"Panama","alpha2":"PA","alpha3":"PAN","numeric":"591","ISO31662":"ISO 3166-2:PA"},{"name":"Papua New Guinea","alpha2":"PG","alpha3":"PNG","numeric":"598","ISO31662":"ISO 3166-2:PG"},{"name":"Paraguay","alpha2":"PY","alpha3":"PRY","numeric":"600","ISO31662":"ISO 3166-2:PY"},{"name":"Peru","alpha2":"PE","alpha3":"PER","numeric":"604","ISO31662":"ISO 3166-2:PE"},{"name":"Philippines","alpha2":"PH","alpha3":"PHL","numeric":"608","ISO31662":"ISO 3166-2:PH"},{"name":"Pitcairn","alpha2":"PN","alpha3":"PCN","numeric":"612","ISO31662":"ISO 3166-2:PN"},{"name":"Poland","alpha2":"PL","alpha3":"POL","numeric":"616","ISO31662":"ISO 3166-2:PL"},{"name":"Portugal","alpha2":"PT","alpha3":"PRT","numeric":"620","ISO31662":"ISO 3166-2:PT"},{"name":"Puerto Rico","alpha2":"PR","alpha3":"PRI","numeric":"630","ISO31662":"ISO 3166-2:PR"},{"name":"Qatar","alpha2":"QA","alpha3":"QAT","numeric":"634","ISO31662":"ISO 3166-2:QA"},{"name":"R\u00e9union","alpha2":"RE","alpha3":"REU","numeric":"638","ISO31662":"ISO 3166-2:RE"},{"name":"Romania","alpha2":"RO","alpha3":"ROU","numeric":"642","ISO31662":"ISO 3166-2:RO"},{"name":"Russian Federation","alpha2":"RU","alpha3":"RUS","numeric":"643","ISO31662":"ISO 3166-2:RU"},{"name":"Rwanda","alpha2":"RW","alpha3":"RWA","numeric":"646","ISO31662":"ISO 3166-2:RW"},{"name":"Saint Barth\u00e9lemy","alpha2":"BL","alpha3":"BLM","numeric":"652","ISO31662":"ISO 3166-2:BL"},{"name":"Saint Helena, Ascension and Tristan da Cunha","alpha2":"SH","alpha3":"SHN","numeric":"654","ISO31662":"ISO 3166-2:SH"},{"name":"Saint Kitts and Nevis","alpha2":"KN","alpha3":"KNA","numeric":"659","ISO31662":"ISO 3166-2:KN"},{"name":"Saint Lucia","alpha2":"LC","alpha3":"LCA","numeric":"662","ISO31662":"ISO 3166-2:LC"},{"name":"Saint Martin (French part)","alpha2":"MF","alpha3":"MAF","numeric":"663","ISO31662":"ISO 3166-2:MF"},{"name":"Saint Pierre and Miquelon","alpha2":"PM","alpha3":"SPM","numeric":"666","ISO31662":"ISO 3166-2:PM"},{"name":"Saint Vincent and the Grenadines","alpha2":"VC","alpha3":"VCT","numeric":"670","ISO31662":"ISO 3166-2:VC"},{"name":"Samoa","alpha2":"WS","alpha3":"WSM","numeric":"882","ISO31662":"ISO 3166-2:WS"},{"name":"San Marino","alpha2":"SM","alpha3":"SMR","numeric":"674","ISO31662":"ISO 3166-2:SM"},{"name":"Sao Tome and Principe","alpha2":"ST","alpha3":"STP","numeric":"678","ISO31662":"ISO 3166-2:ST"},{"name":"Saudi Arabia","alpha2":"SA","alpha3":"SAU","numeric":"682","ISO31662":"ISO 3166-2:SA"},{"name":"Senegal","alpha2":"SN","alpha3":"SEN","numeric":"686","ISO31662":"ISO 3166-2:SN"},{"name":"Serbia","alpha2":"RS","alpha3":"SRB","numeric":"688","ISO31662":"ISO 3166-2:RS"},{"name":"Seychelles","alpha2":"SC","alpha3":"SYC","numeric":"690","ISO31662":"ISO 3166-2:SC"},{"name":"Sierra Leone","alpha2":"SL","alpha3":"SLE","numeric":"694","ISO31662":"ISO 3166-2:SL"},{"name":"Singapore","alpha2":"SG","alpha3":"SGP","numeric":"702","ISO31662":"ISO 3166-2:SG"},{"name":"Slovakia","alpha2":"SK","alpha3":"SVK","numeric":"703","ISO31662":"ISO 3166-2:SK"},{"name":"Slovenia","alpha2":"SI","alpha3":"SVN","numeric":"705","ISO31662":"ISO 3166-2:SI"},{"name":"Solomon Islands","alpha2":"SB","alpha3":"SLB","numeric":"090","ISO31662":"ISO 3166-2:SB"},{"name":"Somalia","alpha2":"SO","alpha3":"SOM","numeric":"706","ISO31662":"ISO 3166-2:SO"},{"name":"South Africa","alpha2":"ZA","alpha3":"ZAF","numeric":"710","ISO31662":"ISO 3166-2:ZA"},{"name":"South Georgia and the South Sandwich Islands","alpha2":"GS","alpha3":"SGS","numeric":"239","ISO31662":"ISO 3166-2:GS"},{"name":"Spain","alpha2":"ES","alpha3":"ESP","numeric":"724","ISO31662":"ISO 3166-2:ES"},{"name":"Sri Lanka","alpha2":"LK","alpha3":"LKA","numeric":"144","ISO31662":"ISO 3166-2:LK"},{"name":"Sudan","alpha2":"SD","alpha3":"SDN","numeric":"736","ISO31662":"ISO 3166-2:SD"},{"name":"Suriname","alpha2":"SR","alpha3":"SUR","numeric":"740","ISO31662":"ISO 3166-2:SR"},{"name":"Svalbard and Jan Mayen","alpha2":"SJ","alpha3":"SJM","numeric":"744","ISO31662":"ISO 3166-2:SJ"},{"name":"Swaziland","alpha2":"SZ","alpha3":"SWZ","numeric":"748","ISO31662":"ISO 3166-2:SZ"},{"name":"Sweden","alpha2":"SE","alpha3":"SWE","numeric":"752","ISO31662":"ISO 3166-2:SE"},{"name":"Switzerland","alpha2":"CH","alpha3":"CHE","numeric":"756","ISO31662":"ISO 3166-2:CH"},{"name":"Syrian Arab Republic","alpha2":"SY","alpha3":"SYR","numeric":"760","ISO31662":"ISO 3166-2:SY"},{"name":"Taiwan, Province of China","alpha2":"TW","alpha3":"TWN","numeric":"158","ISO31662":"ISO 3166-2:TW"},{"name":"Tajikistan","alpha2":"TJ","alpha3":"TJK","numeric":"762","ISO31662":"ISO 3166-2:TJ"},{"name":"Tanzania, United Republic of","alpha2":"TZ","alpha3":"TZA","numeric":"834","ISO31662":"ISO 3166-2:TZ"},{"name":"Thailand","alpha2":"TH","alpha3":"THA","numeric":"764","ISO31662":"ISO 3166-2:TH"},{"name":"Timor-Leste","alpha2":"TL","alpha3":"TLS","numeric":"626","ISO31662":"ISO 3166-2:TL"},{"name":"Togo","alpha2":"TG","alpha3":"TGO","numeric":"768","ISO31662":"ISO 3166-2:TG"},{"name":"Tokelau","alpha2":"TK","alpha3":"TKL","numeric":"772","ISO31662":"ISO 3166-2:TK"},{"name":"Tonga","alpha2":"TO","alpha3":"TON","numeric":"776","ISO31662":"ISO 3166-2:TO"},{"name":"Trinidad and Tobago","alpha2":"TT","alpha3":"TTO","numeric":"780","ISO31662":"ISO 3166-2:TT"},{"name":"Tunisia","alpha2":"TN","alpha3":"TUN","numeric":"788","ISO31662":"ISO 3166-2:TN"},{"name":"Turkey","alpha2":"TR","alpha3":"TUR","numeric":"792","ISO31662":"ISO 3166-2:TR"},{"name":"Turkmenistan","alpha2":"TM","alpha3":"TKM","numeric":"795","ISO31662":"ISO 3166-2:TM"},{"name":"Turks and Caicos Islands","alpha2":"TC","alpha3":"TCA","numeric":"796","ISO31662":"ISO 3166-2:TC"},{"name":"Tuvalu","alpha2":"TV","alpha3":"TUV","numeric":"798","ISO31662":"ISO 3166-2:TV"},{"name":"Uganda","alpha2":"UG","alpha3":"UGA","numeric":"800","ISO31662":"ISO 3166-2:UG"},{"name":"Ukraine","alpha2":"UA","alpha3":"UKR","numeric":"804","ISO31662":"ISO 3166-2:UA"},{"name":"United Arab Emirates","alpha2":"AE","alpha3":"ARE","numeric":"784","ISO31662":"ISO 3166-2:AE"},{"name":"United Kingdom","alpha2":"GB","alpha3":"GBR","numeric":"826","ISO31662":"ISO 3166-2:GB"},{"name":"United States","alpha2":"US","alpha3":"USA","numeric":"840","ISO31662":"ISO 3166-2:US"},{"name":"United States Minor Outlying Islands","alpha2":"UM","alpha3":"UMI","numeric":"581","ISO31662":"ISO 3166-2:UM"},{"name":"Uruguay","alpha2":"UY","alpha3":"URY","numeric":"858","ISO31662":"ISO 3166-2:UY"},{"name":"Uzbekistan","alpha2":"UZ","alpha3":"UZB","numeric":"860","ISO31662":"ISO 3166-2:UZ"},{"name":"Vanuatu","alpha2":"VU","alpha3":"VUT","numeric":"548","ISO31662":"ISO 3166-2:VU"},{"name":"Venezuela, Bolivarian Republic of","alpha2":"VE","alpha3":"VEN","numeric":"862","ISO31662":"ISO 3166-2:VE"},{"name":"Viet Nam","alpha2":"VN","alpha3":"VNM","numeric":"704","ISO31662":"ISO 3166-2:VN"},{"name":"Virgin Islands, British","alpha2":"VG","alpha3":"VGB","numeric":"092","ISO31662":"ISO 3166-2:VG"},{"name":"Virgin Islands, U.S.","alpha2":"VI","alpha3":"VIR","numeric":"850","ISO31662":"ISO 3166-2:VI"},{"name":"Wallis and Futuna","alpha2":"WF","alpha3":"WLF","numeric":"876","ISO31662":"ISO 3166-2:WF"},{"name":"Western Sahara","alpha2":"EH","alpha3":"ESH","numeric":"732","ISO31662":"ISO 3166-2:EH"},{"name":"Yemen","alpha2":"YE","alpha3":"YEM","numeric":"887","ISO31662":"ISO 3166-2:YE"},{"name":"Zambia","alpha2":"ZM","alpha3":"ZMB","numeric":"894","ISO31662":"ISO 3166-2:ZM"},{"name":"Zimbabwe","alpha2":"ZW","alpha3":"ZWE","numeric":"716","ISO31662":"ISO 3166-2:ZW"}],
	
	getHTML : function(siteID, type){
			
		var key = 'alpha2';
		
		if (type != undefined){
			key = type;
		}
		
		// retrieve settings
		var sValue = $("#valuetype").val();
		var sCountryCase = $("#countrycase").val();
		var sValueCase = $("#valuecase").val();
	
		// create html array
		var txt = "<select class='dataValue'>\n";
		
		for (var i = 0; i < isoCountry.data.length; i++) {
			
			// country code
			var code = isoCountry.data[i][key];
			var name = isoCountry.data[i]['name'];
			
			if (code == 'US'){
				txt += "<option value='"+code+"' selected>"+name+"</option>\n";
			}
			else {
				txt += "<option value='"+code+"'>"+name+"</option>\n";
			}	
			
			
		}

		txt += "</select>\n";

		return txt;
	}
	
}