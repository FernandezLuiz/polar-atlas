"use client";
import { useState, useEffect, useRef } from "react";
import { Ship, Users, ShieldAlert, Anchor, Info, X } from "lucide-react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-sm">
      <span className="animate-pulse">Polair 3D-canvas initialiseren...</span>
    </div>
  )
});

// Geografische achtergrond-labels
const geoLabels = [
  { text: "AFRICA", lat: -15.0, lng: 20.0, size: 1.1, color: "#64748b" },
  { text: "SOUTH AMERICA", lat: -25.0, lng: -60.0, size: 1.1, color: "#64748b" },
  { text: "AUSTRALIA", lat: -25.0, lng: 135.0, size: 1.1, color: "#64748b" },
  { text: "ZUIDPOOL", lat: -90, lng: 0, size: 0.9, color: "#94a3b8" },
  { text: "WEDDELL ZEE", lat: -73, lng: -40, size: 0.8, color: "#64748b" },
  { text: "ROSS ZEE", lat: -76, lng: 175, size: 0.8, color: "#64748b" },
  { text: "GRAHAM LAND", lat: -66, lng: -64, size: 0.7, color: "#cbd5e1" },
  { text: "KONINGIN MAUD LAND", lat: -72, lng: 15, size: 0.8, color: "#64748b" }
];

const expeditionsData = [
  {
    id: "belgica",
    title: "De Belgica Expeditie",
    period: "1897 - 1899",
    years: [1897, 1956],
    commander: "Adrien de Gerlache",
    bgStyle: "from-amber-950/20 via-slate-900/90 to-slate-950",
    themeColor: "#f59e0b",
    borderColor: "border-amber-500/30",
    accentBg: "bg-amber-500/10",
    description: "De legendarische Belgische Zuidpoolexpeditie. De SY Belgica kwam dertien maanden lang muurvast te zitten in het meedogenloze poolijs. De bemanning overleefde ternauwernood de hallucinaties en scheurbuik tijdens de angstaanjagende poolnacht.",
    vessel: {
      name: "SY Belgica",
      type: "Omgebouwde Walvisvaarder (Steam Yacht)",
      specs: ["Lengte: 30 meter", "3-laags eikenhout tegen ijsdruk", "150 PK Stoommachine"],
      image: "/img/3142_belgica.jpg", 
      planImage: "/img/5603_scheepsplan.jpg"
    },
    coordinates: { lat: -71.51, lng: -85.26, altitude: 1.4 },
    crew: [
      {
        name: "Adrien de Gerlache",
        role: "Commandant & Leider",
        image: "/img/12504_adrien-de-gerlache.jpg",
        bio: "De visionaire Belgische marineofficier die zijn eigen familiefortuin op het spel zette.",
        fact: "Verkocht zijn eigen bezittingen om de reis te kunnen betalen."
      },
      {
        name: "Roald Amundsen",
        role: "Eerste Stuurman",
        image: "/img/12785_roald-amundsen.jpg",
        bio: "De jonge Noorse poolreiziger die later als eerste mens ooit de geografische Zuidpool zou bereiken.",
        fact: "Sloot zich aan als vrijwilliger zonder loon te eisen om ervaring op te doen."
      },
      {
        name: "Georges Lecointe",
        role: "Kapitein & Hydroloog",
        image: "/img/12556_george-lecointe.jpg",
        bio: "De rechterhand van De Gerlache en verantwoordelijk voor de navigatie en wetenschappelijke metingen.",
        fact: "Was een briljant astronoom van de Koninklijke Sterrenwacht van België."
      },
      {
        name: "Henryk Arctowski",
        role: "Geoloog & Meteoroloog",
        image: "/img/12557_henryck-arctowski.jpg",
        bio: "Poolse wetenschapper die tijdens de ijs-opsluiting de allereerste jaarronde meteorologische data van Antarctica verzamelde.",
        fact: "Het Arctowski-station op King George Island is later naar hem vernoemd."
      },
      {
        name: "Emile Racoviță",
        role: "Spelofiel & Bioloog",
        image: "/img/12501_emile-racovitza.jpg",
        bio: "Roemeense wetenschapper die de fauna en flora van Antarctica in kaart bracht.",
        fact: "Verzamelde tijdens de expeditie meer dan 1.200 zoölogische en botanische specimina."
      },
      {
        name: "Émile Danco",
        role: "Geofysicus",
        image: "/img/12513_emile-danco.jpg",
        bio: "Belgische luitenant belast met de observaties van het aardmagnetisme.",
        fact: "Is helaas tijdens de zware poolnacht aan boord overleden ten gevolge van een hartaandoening."
      },
      {
        name: "Dr. Frederick Cook",
        role: "Scheepsarts & Fotograaf",
        image: "/img/fre.jpg",
        bio: "De Amerikaanse arts die de bemanning redde van scheurbuik door ze te dwingen vers pinguïn- en zeehondenvlees te eten.",
        fact: "Zijn medische vindingrijkheid hield de mannen mentaal op de been tijdens de poolnacht."
      },
      {
        name: "Nansen",
        role: "Scheepskat & Mascotte",
        image: "/img/12495_nansen-de-scheepskat.jpg",
        bio: "De legendarische zwart-witte scheepskat, vernoemd naar de Noorse ontdekkingsreiziger Fridtjof Nansen.",
        fact: "Had de cruciale taak om het schip vrij te houden van ongedierte, maar overleed helaas tijdens de donkere poolnacht."
      }
    ],
    routePoints: [
      { lat: 50.85, lng: 4.35 },
      { lat: -71.51, lng: -85.26 }
    ]
  },
  {
    id: "maggadan",
    title: "Koning Boudewijnbasis",
    period: "1957 - 1961",
    years: [1957, 2006],
    commander: "Gaston de Gerlache",
    bgStyle: "from-sky-950/20 via-slate-900/90 to-slate-950",
    themeColor: "#38bdf8",
    borderColor: "border-sky-500/30",
    accentBg: "bg-sky-500/10",
    description: "Precies 60 jaar na de Belgica leidde Gaston de Gerlache de Belgische terugkeer naar Antarctica. Met de poolijsbreker 'Magga Dan' werd materiaal vervoerd om de eerste permanente Belgische wetenschappelijke basis op op te bouwen aan de kust van de Breidbaai. Het station diende voor cruciaal internationaal onderzoek tijdens het Internationaal Geofysisch Jaar.",
    vessel: {
      name: "Koning Boudewijnbasis",
      type: "Wetenschappelijk Poolstation",
      specs: [
        "Locatie: Breidbaai (Koningin Maudland)",
        "Constructie: Geprefabriceerde houten barakken",
        "Bezetting: Ongeveer 17 wetenschappers en technici",
        "Onderzoek: Meteorologie, ionosfeer, glaciologie en geomagnetisme"
      ],
      image: "/img/expeditie.jpeg",
      planImage: "/img/5322_isfjord.jpg"
    },
    coordinates: { lat: -70.43, lng: 24.31, altitude: 1.4 },
    crew: [
      {
        name: "Gaston de Gerlache",
        role: "Expeditieleider",
        image: "/img/gaston.jpeg",
        bio: "Bracht 60 jaar na zijn vader de Belgen definitief terug naar Antarctica und leidde de bouw van het gloednieuwe station.",
        fact: "Hij was de zoon van Adrien de Gerlache, de commandant van de legendarische Belgica."
      },
      {
        name: "Tony Van Autenboer",
        role: "Geoloog & Glacioloog",
        image: "/img/Tony.jpeg",
        bio: "Verantwoordelijk voor het vloeien en in kaart brengen van de reusachtige Antarctische gletsjers rondom het Sør Rondane-gebergte.",
        fact: "Er is later een ijsvlakte op Antarctica naar hem vernoemd: de Van Autenboer-gletsjer."
      },
      {
        name: "Luc de Goer de Herve",
        role: "Piloot & Geoloog",
        image: "", 
        bio: "Bestuurde de kleine verkenningsvliegtuigen (Auster) om vanuit de lucht veilige routes over het verraderlijke ijs te vinden.",
        fact: "Overleefde een spectaculaire noodlanding in een hevige sneeuwstorm ver weg van de basis."
      },
      {
        name: "De Poolhonden",
        role: "Mascottes & Transport",
        image: "/img/poolhonden.jpg",
        bio: "Groep rasechte husky's die werden ingezet om sleden met zware wetenschappelijke meetapparatuur over het ijs te trekken.",
        fact: "Hoewel er rupsvoertuigen waren, bleken de honden in diepe kloven vaak veel betrouwbaarder."
      }
    ],
    routePoints: [
      { lat: 50.85, lng: 4.35 },
      { lat: -70.43, lng: 24.31 }
    ]
  },
  {
    id: "peae",
    title: "Princess Elisabeth Station",
    period: "2007 - Heden",
    years: [2007, 2026],
    commander: "Alain Hubert",
    bgStyle: "from-cyan-950/20 via-slate-900/90 to-slate-950",
    themeColor: "#22d3ee",
    borderColor: "border-cyan-500/30",
    accentBg: "bg-cyan-500/10",
    description: "Het Princess Elisabeth Antarctica is het allereerste 'Zero Emission' onderzoeksstation ter wereld. Dit technologische meesterwerk functioneert volledig op wind- en zonne-energie. Het is dieper landinwaarts gebouwd op de blootliggende rotsen van de Utsteinen Nunatak, waar wetenschappers uit de hele wereld grensverleggend klimaatonderzoek doen.",
    vessel: {
      name: "Princess Elisabeth Antarctica",
      type: "Zero-Emission Wetenschappelijk Station",
      specs: [
        "Locatie: Utsteinen Nunatak (1730 meter boven zeeniveau)",
        "Energievoorziening: 100% hernieuwbaar (9 windturbines & 400+ zonnepanelen)",
        "Constructie: Gelaagd micro-design (roestvrij staal, dennenhout en dikke isolatie)",
        "Waterbeheer: Geavanceerd micro-zuiveringssysteem dat 100% van het afvalwater recycled"
      ],
      image: "/img/pe_station.jpg", 
      planImage: "/img/pe_technisch_plan.jpg" 
    },
    coordinates: { lat: -72.01, lng: 23.34, altitude: 1.4 }, 
    crew: [
      {
        name: "Alain Hubert",
        role: "Stichter & Expeditieleider",
        image: "/img/alain_hubert.jpg",
        bio: "Belgische ontdekkingsreiziger en gids die het revolutionaire concept bedacht en de loodzware bouw in de ijskoude wind coördineerde.",
        fact: "Hij legde ooit samen met Dixie Dansercoer 3.924 kilometer te voet af over Antarctica, een wereldrecord in 1997."
      },
      {
        name: "Dr. Vinciane Debaille",
        role: "Geologe & Meteorietenjager",
        image: "/img/vi.jpg",
        bio: "Leidt expedities rondom het station om meteorieten te zoeken die perfect bewaard zijn gebleven in het blauwe ijs.",
        fact: "Ze vond samen met haar team een record-meteoriet van maar liefst 7,6 kilo op het Antarctische ijs!"
      },
      {
        name: "Het Smart Grid",
        role: "Het 'Digitale' Brein",
        image: "/img/smartgrid.jpg",
        bio: "Het hypermoderne computersysteem dat continu de energie verdeelt. Als de wind stopt, zet het systeem zware apparaten uit om stroom te besparen.",
        fact: "Dankzij dit brein verbruikt het station maar één tredje van de energie van een normaal poolstation."
      }
    ],
    routePoints: [
      { lat: 50.85, lng: 4.35 },
      { lat: -72.01, lng: 23.34 }
    ]
  },
];

export default function PolarAtlas3D() {
  const [year, setYear] = useState(1897);
  const [activeExpedition, setActiveExpedition] = useState(expeditionsData[0]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overzicht" | "crew" | "schip">("overzicht");
  const [isRotating, setIsRotating] = useState(true); 
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null); 
  
  const globeEl = useRef<any>(null);
  const idleTimerRef = useRef<any>(null);

  const resetIdleTimer = () => {
    setIsRotating(false);
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) controls.autoRotate = false;
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setIsRotating(true);
      if (globeEl.current) {
        const controls = globeEl.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.4; 
        }
      }
    }, 120000); 
  };

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = isRotating;
        controls.autoRotateSpeed = 0.4; 
      }
    }
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (globeEl.current && !isRotating) {
      globeEl.current.pointOfView({
        lat: activeExpedition.coordinates.lat,
        lng: activeExpedition.coordinates.lng,
        altitude: activeExpedition.coordinates.altitude
      }, 1400);
    }
  }, [activeExpedition]);

  useEffect(() => {
    const found = expeditionsData.find(
      (exp) => year >= exp.years[0] && year <= exp.years[1]
    );
    if (found && found.id !== activeExpedition.id) {
      setActiveExpedition(found);
      setActiveTab("overzicht");
    }
  }, [year]);

  return (
    <main 
      onMouseMove={resetIdleTimer}
      onTouchStart={resetIdleTimer}
      onClick={resetIdleTimer}
      className={`min-h-screen bg-gradient-to-b ${activeExpedition.bgStyle} text-slate-100 font-sans relative overflow-hidden transition-colors duration-1000`}
    >
      
      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.015] bg-[url('https://www.transparenttextures.com/patterns/padded-cells.png')]" />

      {/* BOVENBALK */}
      <header className="absolute top-0 left-0 right-0 p-6 z-30 flex justify-between items-start backdrop-blur-md bg-slate-950/40 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-light font-sans">
               Interactieve Installatie
            </p>
          </div>
          <h1 className="text-xl font-extralight tracking-widest text-white mt-1.5 uppercase font-sans">
            Belgische Poolreizen <span className="text-cyan-500/60 font-normal">/</span> 
          </h1>
        </div>
        <div className="bg-slate-950/80 px-6 py-3 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md text-right">
          <p className="text-[10px] uppercase font-mono text-slate-400 tracking-widest">Geselecteerd Jaar</p>
          <p className="text-3xl font-light tracking-wider font-mono text-blue-400">{year}</p>
        </div>
      </header>

      {/* 3D GOOGLE EARTH CANVAS */}
      <div className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="#020617"
          showAtmosphere={true}
          atmosphereColor="#1e40af"
          atmosphereAltitude={0.25}
          
          arcsData={[
            {
              startLat: activeExpedition.routePoints[0].lat,
              startLng: activeExpedition.routePoints[0].lng,
              endLat: activeExpedition.coordinates.lat,
              endLng: activeExpedition.coordinates.lng,
              color: activeExpedition.themeColor,
            }
          ]}
          arcColor={(d: any) => d.color}
          arcStroke={0.4}               
          arcAltitude={0.35}             
          arcDashLength={0.03}          
          arcDashGap={0.02}             
          arcDashAnimateTime={0}        

          labelsData={geoLabels}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelText={(d: any) => d.text}
          labelSize={(d: any) => d.size}
          labelColor={(d: any) => d.color}
          labelResolution={3}
          labelIncludeDot={true}
          labelDotRadius={0.15}

          htmlElementsData={[
            { ...activeExpedition, isStation: true },
            { id: "belgium_marker", coordinates: { lat: 50.85, lng: 4.35 }, title: "BELGIUM", vessel: { name: "" }, isStation: false }
          ]}
          htmlLat={(d: any) => d.coordinates?.lat}
          htmlLng={(d: any) => d.coordinates?.lng}
          htmlElement={(d: any) => {
            const el = document.createElement("div");
            
            if (d.isStation) {
              el.innerHTML = `
                <div class="flex flex-col items-center pointer-events-auto cursor-pointer" style="transform: translate(-50%, -100%);">
                  <div class="w-4 h-4 rounded-full flex items-center justify-center animate-pulse" style="background: ${d.themeColor || '#fff'};">
                    <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div class="mt-2 bg-slate-950/90 border rounded-lg px-3 py-1.5 shadow-2xl backdrop-blur-md text-center flex flex-col items-center whitespace-nowrap" style="border-color: ${d.themeColor || '#fff'}50;">
                    <span class="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Actieve Locatie</span>
                    <span class="text-xs font-sans font-bold text-white tracking-wide uppercase mt-0.5">${d.vessel?.name || ''}</span>
                  </div>
                  <div class="w-2 h-2 rotate-45 -mt-1" style="background: rgba(2, 6, 23, 0.9); border-right: 1px solid ${d.themeColor || '#fff'}50; border-bottom: 1px solid ${d.themeColor || '#fff'}50;"></div>
                </div>
              `;
              el.onclick = () => {
                resetIdleTimer();
                if (d.id !== "belgium_marker") setSelectedMarker(d.id);
              };
            } else {
              el.innerHTML = `
                <div class="flex flex-col items-center pointer-events-none" style="transform: translate(-50%, -130%);">
                  <span class="text-xs font-mono font-bold text-white tracking-[0.2em] bg-slate-950/60 px-2 py-0.5 rounded backdrop-blur-sm shadow-md border border-white/5 uppercase">
                    ${d.title || 'BELGIUM'}
                  </span>
                  <div class="w-1.5 h-1.5 bg-white rounded-full mt-1 shadow-md"></div>
                </div>
              `;
            }
            return el;
          }}
        />
      </div>

      {/* RECHTSONDER INTERACTIE PANEEL */}
      <div className="absolute bottom-36 left-6 right-6 md:right-auto md:w-full md:max-w-md z-20 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/85 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Era: {activeExpedition.period}
            </span>
            <h2 className="text-2xl font-light text-white tracking-tight mt-2">
              {activeExpedition.title}
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mt-2 font-light">
              {activeExpedition.description}
            </p>
          </div>

          <button 
            onClick={() => setSelectedMarker(activeExpedition.id)}
            className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-white hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Ship className="w-4 h-4 text-blue-400" />
              <div className="text-left">
                <p className="text-[9px] uppercase font-mono text-slate-400">Logboek openen</p>
                <p className="text-xs font-semibold text-white">{activeExpedition.vessel.name}</p>
              </div>
            </div>
            <span className="text-xs font-mono opacity-40 group-hover:opacity-100 transition-opacity">&rarr;</span>
          </button>
        </div>
      </div>

      {/* POP-UP ARCHIEF OVERLAY */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            
            <div className="p-4 bg-slate-950/60 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-light text-white">{activeExpedition.title} <span className="text-xs font-mono text-slate-500">({activeExpedition.period})</span></h3>
              <button onClick={() => setSelectedMarker(null)} className="p-2 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-white/5 bg-slate-950/20">
              {[
                { id: "overzicht", label: "Historiek", icon: Info },
                { id: "crew", label: "De Bemanning", icon: Users },
                { 
                  id: "schip", 
                  label: activeExpedition.id === "belgica" ? "Technische Specs" : "Bouwplan Basis", 
                  icon: Anchor 
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-5 flex items-center gap-2 border-b-2 text-xs font-mono tracking-wide transition-all ${
                    activeTab === tab.id ? "border-blue-400 text-blue-400 bg-white/5" : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-950">
              {activeTab === "overzicht" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed font-serif text-base">{activeExpedition.description}</p>
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-[10px] uppercase font-mono text-blue-400 flex items-center gap-2"><ShieldAlert className="w-3.5 h-3.5" /> Historisch Weetje</p>
                      <p className="text-slate-300 mt-2 italic font-serif text-sm">{activeExpedition.crew[0]?.fact}</p>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-black group relative">
                    <img 
                      src={activeExpedition.vessel.image} 
                      alt="Expeditie" 
                      className="w-full h-full object-cover sepia-[0.25] cursor-zoom-in hover:scale-[1.02] transition-transform duration-300"
                      onClick={() => setEnlargedImage(activeExpedition.vessel.image)}
                    />
                  </div>
                </div>
              )}

              {activeTab === "crew" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeExpedition.crew.map((member, i) => (
                    <div key={i} className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10 flex items-center justify-center">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover sepia-[0.3] cursor-zoom-in hover:opacity-80 transition-opacity" 
                            onClick={() => setEnlargedImage(member.image)}
                          />
                        ) : (
                          <div className="text-xl font-mono font-light tracking-wider text-sky-400 select-none">
                            {member.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-mono text-blue-400 uppercase tracking-widest">{member.role}</p>
                        <h4 className="text-sm font-medium text-white">{member.name}</h4>
                        <p className="text-xs text-slate-400 font-light leading-snug">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "schip" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-950/40 p-5 rounded-xl border border-white/5 space-y-3">
                    <h4 className="text-base font-medium text-white">{activeExpedition.vessel.name}</h4>
                    <p className="text-xs font-mono text-blue-400">{activeExpedition.vessel.type}</p>
                    <ul className="space-y-2 pt-3 border-t border-white/5 text-xs text-slate-300 font-light">
                      {activeExpedition.vessel.specs.map((spec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-blue-400" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black p-2 flex items-center justify-center">
                    <img 
                      src={activeExpedition.vessel.planImage} 
                      alt="Scheepsplan of Bouwtekening" 
                      className="max-h-[250px] object-contain rounded opacity-85 sepia contrast-125 cursor-zoom-in hover:scale-[1.03] transition-transform duration-300" 
                      onClick={() => setEnlargedImage(activeExpedition.vessel.planImage)}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- LIGHTBOX VOOR VERGROTE HISTORISCHE FOTO'S --- */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300"
          onClick={() => setEnlargedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all font-mono text-xs tracking-widest uppercase border border-white/10"
            onClick={() => setEnlargedImage(null)}
          >
            ✕ Sluiten
          </button>
          
          <div className="relative max-w-[90vw] max-h-[80vh] p-1 bg-slate-900/40 border border-white/10 rounded-xl shadow-2xl">
            <img 
              src={enlargedImage} 
              alt="Gecureerd Museum Beeldmateriaal" 
              className="max-w-full max-h-[75vh] object-contain rounded-lg select-none shadow-inner"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}

      {/* TIJDLIJN BALK ONDERAAN */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-30">
        <div className="max-w-4xl mx-auto bg-slate-950/80 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-2xl">
          <div className="flex justify-between text-[10px] tracking-widest uppercase font-mono text-slate-500 mb-2">
            <span className={year < 1957 ? "text-amber-400 font-bold" : ""}>1897: Belgica</span>
            <span className={year >= 1957 && year < 2007 ? "text-sky-400 font-bold" : ""}>1957: Boudewijnbasis</span>
            <span className={year >= 2007 ? "text-cyan-400 font-bold" : ""}>2007 - Nu: PE Station</span>
          </div>
          
          <input 
            type="range" min="1897" max="2026" value={year}
            onChange={(e) => {
              resetIdleTimer();
              setYear(parseInt(e.target.value));
            }}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
          
          <div className="flex justify-between font-mono text-[9px] opacity-30 text-slate-500 mt-1.5 px-1">
            <span>1897</span><span>1915</span><span>1935</span><span>1955</span><span>1975</span><span>1995</span><span>2015</span><span>2026</span>
          </div>
        </div>
      </footer>

    </main>
  );
}