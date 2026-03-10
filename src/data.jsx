import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PlayCircle, ArrowRight, Check, Award, HelpCircle, Database, Zap, ChevronDown, X } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- IMAGE IMPORTS ---
import zmajImg from './zmaj.jpg';
import novaSlikaImg from './nova-slika.png';
import slikaHubImg from './slika-hub.jpeg';
import slikaCopyImg from './slika-copy.jpeg';
import hollywoodImg from './hollywood.png';
import slikaVideoImg from './slika-video.jpeg';
import mojLogo from './logo.png';

export const logoUrl = mojLogo; 
export const bannerUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
export const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
export const CLOUDINARY_UPLOAD_PRESET = "uploads1"; 
export const ADMIN_DEFAULT_DESC = `[DESCRIPTION]\nEnter your main description here...\n\nKEY FEATURES\n* Feature 1\n* Feature 2\n* Feature 3\n\nVALUE MULTIPLIER\n* Benefit 1\n* Benefit 2`;
export const MY_VIDEOS = [];

// ============================================================================
// 1. MEGA BAZE TOKENA
// ============================================================================

// SPECIFIČNI META TOKENI ZA UNIQUE PHOTOREAL
const UNIQUE_META_POOL = [
  "UltraPhotorealistic", "HyperRealism", "ExtremeDetail", "NanoDetail_8K", "MicroTexture_Rendering", 
  "UltraDepth_Field", "Global_Illumination", "RayTraced_Reflections", "Ambient_Occlusion", 
  "Sensor_Noise_Realism", "Film_Grain_Texture", "Natural_Skin_Pores", "Subsurface_Scattering", "Optical_Lens_Distortion"
];

const UNIQUE_PHOTOREAL_COMBOS = [
  "ARRI Alexa 35 + Zeiss Supreme Prime 35mm f/1.5 × UltraDepth_Field • NanoDetail_8K • RAW_grain_lite × atmospheric micro-particles, tactile realism, cinematic optical depth",
  "RED Raptor V + Leica Summilux-C 50mm T1.4 × SensorBloom_v2 • SkinMicroTexture_v5 • HDR_vision_fusion × hyper-real pores, organic skin scattering, optical contrast",
  "Sony Venice 2 + Cooke S7/i 75mm T2 × ColorScience_CinemaCore • VolumetricRayTrace • UltraFineShadowMap × luminous dust particles, volumetric air depth",
  "IMAX MSM 9802 + Panavision C-Series 40mm T2.3 × FilmGrain_TrueIMAX • SpectralLightCapture × colossal cinematic scale, natural optical falloff",
  "ARRI Alexa Mini LF + Zeiss Master Prime 100mm T1.3 × MicroContrast_Boost • OpticalBokehSignature × crystalline highlights, hyper-real reflections",
  "RED V-Raptor XL + Sigma Cine FF 24mm T1.5 × UltraSharp_GlobalDetail • EdgeFalloffNatural × spatial realism, lens breathing authenticity",
  "Sony FX3 + Sony G Master 85mm f/1.4 × SkinPoreAmplifier • DepthCompression_v3 × natural facial microstructure, photonic skin scattering",
  "Leica SL2-S + Leica APO-Summicron 50mm f/2 × LeicaMicroContrast • OpticalPrecisionDepth × clinical realism, glass-perfect optics",
  "Canon EOS R5 + RF 28-70mm f/2 × HDRDynamicStack • ColorDepth16bit × ultra clean highlights, natural tonal rolloff",
  "Nikon Z9 + Nikkor Z 58mm f/0.95 Noct × UltraCreamBokeh • PhotonBloom × ethereal subject isolation",
  "Phase One XF IQ4 150MP + Schneider Kreuznach 80mm LS × MediumFormatHyperDetail • PixelPrecision × microscopic texture realism",
  "Hasselblad X2D 100C + XCD 90mm f/2.5 × NordicColorScience × ultra clean medium-format rendering",
  "Fujifilm GFX100 II + GF 110mm f/2 × FilmSim_NaturalPro × analog tonal softness",
  "Blackmagic URSA Mini Pro 12K + Zeiss Supreme 65mm × CinemaRAWTexture × high dynamic micro-detail",
  "Panasonic Lumix S1H + Leica DG Vario-Summilux 25-50mm × NaturalSkinTones_v3 × cinematic color separation",
  "ARRI Alexa 35 + Cooke Panchro/i Classic 50mm × VintageGlassCharacter × organic lens personality",
  "RED Komodo X + Laowa 24mm Probe Lens × MacroRealityCapture × hyper-detailed environmental textures",
  "Sony A1 + Sony 135mm GM × UltraOpticalCompression × perfect subject depth layering",
  "Canon EOS R3 + RF 85mm f/1.2L × PortraitRealismStack × lifelike skin translucency",
  "Nikon D850 + Sigma Art 40mm f/1.4 × PrecisionOpticsMode × clinical sharpness",
  "ARRI Alexa LF + Panavision Primo 70mm × PanavisionColorSignature × cinematic highlight bloom",
  "RED Raptor V + Zeiss Supreme 21mm × SpatialDepthAnalyzer × immersive environmental realism",
  "Sony Venice + Fujinon Premista 28-100mm × NaturalLensBreathing × cinematic zoom realism",
  "Leica M11 + Noctilux 50mm f/0.95 × LeicaGlowSignature × dreamy photoreal light halos",
  "Hasselblad H6D-400c + HC 100mm × UltraResolutionStack × hyper-micro detail",
  "DJI Inspire 3 + Zenmuse X9 DL 35mm × AerialScaleCapture × monumental landscape depth",
  "DJI Mavic 3 Pro + Hasselblad 24mm × AeroSharpness × aerial cinematic realism",
  "GoPro Hero 12 + Max Lens Mod × ActionDistortionPhysics × immersive POV realism",
  "RED Raptor XL + Angenieux Optimo 24-290mm × CinemaZoomPrecision × professional zoom optics",
  "ARRI Alexa 35 + Zeiss Ultra Prime 85mm × UltraDepthCompression × intense portrait depth",
  "Sony FX6 + Sony G Master 50mm × NaturalMotionRealism × documentary authenticity",
  "Canon C500 Mark II + CN-E 85mm × CineColorBalance × neutral cinematic palette",
  "Blackmagic 6K Pro + Sigma Cine 35mm × RAWTextureLayer × high fidelity detail",
  "Fujifilm X-H2S + XF 56mm f/1.2 × PortraitFilmLook × organic skin tones",
  "Panasonic GH6 + Leica 42.5mm × HybridCinematicLook × rich contrast",
  "ARRI Alexa Mini + Master Macro 100mm × MacroHyperReality × extreme surface detail",
  "RED Helium 8K + Zeiss Supreme 50mm × NanoDetail_8K × photonic realism",
  "Sony A7S III + Sony 35mm GM × LowLightPhotonCapture × night realism",
  "Canon EOS R6 + RF 50mm f/1.2 × SkinReflectanceModel × true skin physics",
  "Nikon Z7 II + Nikkor Z 85mm × MicroContrastEngine × sculpted light",
  "Leica SL2 + APO-Summicron 75mm × OpticalClarityBoost × clinical image clarity",
  "Hasselblad X1D II + XCD 80mm × MediumFormatDepth × elegant tonal rendering",
  "Phase One IQ3 + Schneider 110mm × HyperResolutionCapture × microscopic realism",
  "DJI Mavic Air 3 + 70mm Tele × AerialDepthCompression × cinematic drone look",
  "RED Komodo + Sigma Cine 24mm × WideSpatialRealism × immersive perspective",
  "Sony Venice 2 + Cooke Anamorphic/i 50mm × AnamorphicBloom × horizontal flare signature",
  "ARRI Alexa LF + Hawk Anamorphic 65mm × CinematicFlarePhysics × epic lens flare",
  "RED V-Raptor + Atlas Orion 40mm × AnamorphicStretch × filmic distortion realism",
  "Sony FX9 + Zeiss CP3 85mm × CinematicPortraitMode × hyper natural lighting",
  "Canon C70 + RF 35mm × DocumentaryNaturalism × realistic lighting physics",
  "Blackmagic Pocket 4K + Olympus 25mm × IndieFilmTexture × raw organic feel",
  "Fujifilm GFX50S II + GF 120mm Macro × MacroSkinDetail × tactile textures",
  "Panasonic S5 II + Sigma 85mm × UltraSkinToneMap × warm portrait realism",
  "ARRI Alexa 65 + Panavision System 65 50mm × EpicScaleDepth × massive cinematic scale",
  "RED Monstro 8K + Sigma Cine 50mm × UltraClarityEngine × crystal sharp rendering",
  "Sony A9 III + Sony 24mm GM × SpeedCaptureReality × frozen motion realism",
  "Canon 5D Mark IV + EF 50mm × ClassicPhotoRealism × timeless photographic look",
  "Nikon D6 + Nikkor 70-200mm × TeleCompressionLook × subject isolation",
  "Leica Q3 + Summilux 28mm × LeicaStreetRealism × candid photographic authenticity",
  "Hasselblad H5D + HC 80mm × NordicTonalBalance × elegant color science",
  "Phase One XF + Schneider 55mm × PixelIntegrityEngine × ultra clean resolution",
  "DJI Inspire 2 + X7 50mm × AerialFilmLook × cinematic aerial storytelling",
  "GoPro Hero 11 + UltraWide × ImmersivePOVReality × dynamic environmental depth",
  "RED Dragon 6K + Zeiss CP2 35mm × CinemaTextureStack × natural film grain",
  "Sony A7R V + 90mm Macro × MicroTextureAmplifier × extreme surface realism",
  "Canon EOS R5C + RF 24mm × CinemaHybridMode × high dynamic range detail",
  "Nikon Z8 + Nikkor Z 50mm × PrecisionColorScience × ultra balanced tones",
  "Leica M10-R + Summicron 35mm × StreetAuthenticityMode × documentary realism",
  "ARRI Alexa 35 + Cooke S4 32mm × CookeLookSignature × warm cinematic softness",
  "RED V-Raptor + Leica Summilux-C 75mm × UltraLensCharacter × organic bokeh",
  "Sony Venice + Zeiss Supreme 65mm × SpectralHighlightControl × luminous highlights",
  "Canon C300 Mark III + CN-E 50mm × CineDynamicRange × rich shadow detail",
  "Blackmagic 12K + Zeiss CP3 21mm × WideCinemaRealism × spatial depth",
  "Fujifilm X-T5 + XF 33mm × FilmSimulationDepth × nostalgic color tones",
  "Panasonic GH5 II + Leica 25mm × HybridCinemaLook × crisp cinematic realism",
  "ARRI Alexa Mini LF + Panavision Primo 50mm × CinematicShadowRoll × elegant lighting",
  "RED Komodo X + Atlas Mercury 36mm × AnamorphicCinematicMode × stretched cinematic look",
  "Sony FX3 + Sony 24mm GM × NightPhotonBoost × atmospheric night realism",
  "Canon EOS R8 + RF 85mm × PortraitLightBalance × studio realism",
  "Nikon Zf + Voigtländer 50mm × VintageOpticsSignature × analog aesthetic",
  "Leica SL3 + APO-Summicron 90mm × PrecisionOpticalStack × hyper clean detail",
  "Hasselblad X2D + XCD 65mm × NordicNaturalColor × refined tones",
  "Phase One XF IQ4 + Schneider 80mm × PixelDepthEngine × extreme clarity",
  "DJI Mavic 3 Pro Cine + Hasselblad 24mm × AerialHDRCapture × cinematic skies",
  "GoPro Hero 12 + Linear Lens × ActionRealismEngine × dynamic POV immersion",
  "ARRI Alexa 35 + Zeiss Supreme 50mm × UltraRealismStack × evidence-grade detail",
  "RED Raptor XL + Cooke S7/i 50mm × CinematicTextureDepth × cinematic realism",
  "Sony Venice 2 + Panavision Primo 65mm × EpicPortraitMode × monumental portrait realism",
  "IMAX MSM 9802 + IMAX 80mm × UltraEpicCapture × giant format realism",
  "ARRI Alexa LF + Zeiss Master Prime 50mm × OpticalPerfectionStack × cinematic clarity",
  "RED V-Raptor + Sigma Cine 85mm × PortraitHyperDetail × intense subject realism",
  "Sony A1 + Sony 50mm GM × CrystalSharpnessMode × ultra optical precision",
  "Canon R5 + RF 85mm f/1.2 × SkinToneSpectralMap × lifelike portrait",
  "Nikon Z9 + Noct 58mm × PhotonGlowCapture × luminous highlights",
  "Leica M11 + APO-Summicron 50mm × LeicaPrecisionRender × pure optical realism",
  "Hasselblad X2D + XCD 90mm × MediumFormatCinematicDepth × elegant depth rendering",
  "Phase One XF + Schneider 120mm × MacroUltraDetail × tactile realism",
  "ARRI Alexa 35 + Cooke S7/i 100mm × CinematicPortraitDepth × ultra cinematic realism"
];

const ABSTRACT_META_TOKENS = [
  "AbstractComposition", "GenerativeArt", "ProceduralDesign", "AlgorithmicPatterns", "ParametricShapes", "FractalGeometry", 
  "RecursiveStructures", "OrganicAbstraction", "FluidGeometry", "DynamicShapes", "MorphingForms", "LiquidStructures", 
  "GeometricHarmony", "ComplexSymmetry", "AsymmetricBalance", "VisualEntropy", "StructuredChaos", "RandomizedPatterns", 
  "EmergentForms", "InterlockingGeometry", "FractalPatterns", "MandelbrotStructures", "JuliaFractalForms", "RecursiveGeometry", 
  "InfinitePatternLoops", "SelfSimilarStructures", "MathematicalTextures", "AlgorithmicFractals", "HyperbolicGeometry", 
  "TopologyInspiredForms", "LiquidMetalFlow", "FluidDynamicsPatterns", "InkInWaterEffect", "SmokeLikeStructures", 
  "MeltingGeometry", "ViscousFlowForms", "OrganicWavePatterns", "BiomorphicShapes", "CellularPatterns", "NeuralLikeStructures", 
  "SpectralColorGradient", "IridescentSurface", "LuminousLight", "ChromaticEnergyFlow", "PrismaticReflections", 
  "RainbowDiffraction", "LuminousColorFields", "ElectricColorPulse", "GlowingParticleFields", "GlassLikeSurfaces", 
  "CrystalStructures", "LiquidGlassEffect", "MetallicFluidTextures", "GranularSurfaces", "ParticleDustFields", 
  "SoftGradientTextures", "SmoothProceduralSurface", "EnergyFilamentTextures", "FiberLikeStructures", "EnergyWavePatterns", 
  "QuantumLikeMotion", "ParticleFieldDynamics", "FlowFieldSimulation", "MagneticFieldLines", "VortexEnergy", "SwirlingParticles", 
  "PlasmaLikeEnergy", "CosmicEnergyStreams", "DynamicFieldMotion", "NeuralNetworkAesthetic", "AI_GENERATIVE_ART", 
  "ProceduralVisualSystem", "LatentSpaceExploration", "AlgorithmicAesthetic", "SyntheticVisualLanguage", "DigitalDreamscape", 
  "ExperimentalVisualArt", "FutureAbstractDesign", "ComputationalArt"
];

const META_TOKENS = [
  "UltraPhotorealistic", "HyperRealism", "ExtremeDetail", "NanoDetail", "MicroTextureRendering", "UltraSharpFocus", 
  "CrystalClearImage", "PerfectExposure", "UltraDynamicRange", "HDRFusion", "TrueColorAccuracy", "ACESColorScience", 
  "CinematicColorGrading", "RealWorldOptics", "LensMicroContrast", "OpticalAccuracy", "SensorPrecision", "RAWImageQuality", 
  "NaturalSkinPores", "SubsurfaceScattering", "SkinMicroDetail", "HairStrandRendering", "NaturalImperfections", 
  "PhotographicNoise", "SensorGrain", "FilmGrainTexture", "CinematicDepth", "RealisticLightBounce", "GlobalIllumination", 
  "VolumetricLighting", "GodRays", "SoftShadowGradients", "RayTracedReflections", "AmbientOcclusion", "NaturalLightFalloff", 
  "SpecularHighlights", "MicroShadowDetail", "HighFrequencyDetail", "UltraSharpEdges", "LensBokeh", "ShallowDepthFocus", 
  "UltraWidePerspective", "LongLensCompression", "NaturalPerspective", "RealisticScale", "PhysicalCameraPlacement", 
  "LensSignatureLook", "LensDistortion", "ChromaticAberration", "LensBloom", "LightDiffusion", "AtmosphericPerspective", 
  "EnvironmentalDepth", "FogScattering", "VolumetricFog", "DustParticlesInAir", "MoistureInAir", "CondensationEffects", 
  "SurfaceTexturePrecision", "MaterialAccuracy", "SurfaceMicroScratches", "BrushedMetalTexture", "GlassRefraction", 
  "WaterSurfacePhysics", "RealisticReflections", "WetSurfaceHighlights", "NaturalMotionBlur", "HighShutterClarity", 
  "FreezeFrameDetail", "DynamicRangeCompression", "PhotographicColorScience", "KodakFilmLook", "FujiFilmLook", 
  "ARRIColorProfile", "SonyVeniceColorScience", "IMAXClarity", "StudioLightingPrecision", "GoldenHourLighting", 
  "BlueHourLighting", "SunsetColorTemperature", "MorningSoftLight", "NaturalDaylightBalance", "NightCinematicLighting", 
  "NeonLightReflections", "UrbanNightAtmosphere", "EpicLandscapeScale", "GrandEnvironmentDetail", "UltraWideCinematicFrame", 
  "ProfessionalPhotographyLook", "EditorialPhotographyStyle", "LuxuryAdvertisingLook", "DocumentaryPhotography", 
  "NationalGeographicStyle", "StreetPhotographyRealism", "ArchitecturalPrecision", "ProductPhotographyLuxury", 
  "UltraLuxuryVisualStyle", "MuseumGradeImage", "MasterpieceComposition", "PerfectExposureBalance", "HumanEyeRealism", 
  "RealityGradeImage", "PhotorealCameraPhysics", "OpticalDepthMapping", "UltraHDRDetail", "HyperSurfaceTexture", 
  "PrecisionLightingModel", "PhysicallyAccurateReflections", "OpticalGlareEffect", "HighDynamicContrast", "MicroSurfaceDetail", 
  "SpectralColorAccuracy", "NaturalShadowDepth", "RayBasedLighting", "StudioGradeExposure", "RealSensorBehavior", 
  "CinematicOpticalFlow", "VisualClarityEngine", "DeepFocusCinematic", "LensCompressionEffect", "FineTextureCapture", 
  "HDRMicroContrast", "AdvancedColorCalibration", "NaturalSkinReflection", "SubtleFilmGrain", "RealGlassReflections", 
  "AmbientLightDiffusion", "NaturalColorBalance", "DeepShadowDetail", "UltraContrastClarity", "RealWorldLightPhysics", 
  "OpticalSurfaceReflections", "LightScatterSimulation", "AtmosphericLightDiffusion", "SubtleDepthLayers", 
  "DynamicShadowGradient", "SpectralLightingAccuracy", "FineDetailRendering", "MicroHighlightDetail", "LensEdgeFalloff", 
  "UltraFocusPrecision", "NaturalAtmosphericDepth", "UltraSharpMicroContrast", "ProfessionalCameraLook", "SensorLevelDetail", 
  "HDRLightMapping", "UltraDetailEnhancement", "HyperCinematicLighting", "GlobalLightTransport", "RealisticSpecularResponse", 
  "FilmGradeColorScience", "PhotographicSharpness", "UltraFineGrain", "TrueMaterialResponse", "AdvancedLensSimulation", 
  "DeepColorDepth", "RealReflectionMapping", "HDRShadowRecovery", "MicroDetailEnhancer", "HyperRealSurfaceResponse"
];

const ENV_TOKENS = [
  "AncientStoneTemple", "LostJungleCity", "DenseRainforest", "MysticalForest", "FogCoveredForest", "EnchantedWoods", 
  "SnowCoveredPineForest", "FrozenForest", "AutumnForestPath", "GoldenSunlitForest", "VastMountainRange", "SnowyMountainPeak", 
  "RockyMountainCliffs", "HimalayanLandscape", "VolcanicMountain", "MistyMountainValley", "SunriseMountainView", "AlpineLakeView", 
  "EndlessDesertDunes", "DesertSunsetLandscape", "AncientDesertRuins", "SaharaSandstorm", "DesertOasis", "RockyDesertPlateau", 
  "CrystalBlueOcean", "DeepOceanAbyss", "SunlightUnderwaterRays", 
  "KelpForestUnderwater", "BioluminescentOcean", "TropicalIslandLagoon", "HiddenIslandParadise", "PalmBeachSunset", 
  "CliffsideOceanView", "TurquoiseWaterBay", "VividCityNight", "FuturisticCitySkyline", "FlyingCarCity", 
  "UltraModernCityCenter", "HighTechCityDistrict", "RainyFuturisticStreet", "LuxuryPenthouseView", "SkyscraperRooftop", 
  "GlassTowerInterior", "LuxuryHotelLobby", "ModernArchitecturalHall", "AncientRomanColosseum", "MedievalCastleCourtyard", 
  "AncientGreekTemple", "AncientEgyptianPyramid", "AztecTempleComplex", "VikingVillage", "StoneAgeSettlement", 
  "SpaceStationInterior", "DeepSpaceOrbit", "AlienPlanetSurface", "RingedPlanetHorizon", "AsteroidField", "InterstellarNebula", 
  "GalacticStarField", "FrozenArcticLandscape", "IceCaveInterior", "GlacierValley", "SnowstormWilderness", 
  "AbandonedIndustrialFactory", "RustyIndustrialWarehouse", "OldPowerPlant", "AbandonedRailwayStation", "UrbanRuinsDistrict", 
  "ModernResearchLaboratory", "HighTechControlRoom", "AICommandCenter", "FuturisticLaboratory", "HiddenUndergroundBunker", 
  "SecretMilitaryBase", "WarRoomInterior", "SubmarineInterior", "LuxurySportsCarGarage", "ClassicCarShowroom", "SupercarTunnel", 
  "GrandRoyalPalace", "LuxuryBallroom", "RoyalGarden", "GoldenThroneHall", "AncientLibraryHall", "OldUniversityLibrary", 
  "SecretArchiveRoom", "MysticBookChamber", "FloatingIslandsLandscape", "FantasyCrystalCave", "DragonMountainLair", 
  "MagicPortalValley", "MassiveWaterfallCliff", "RainforestWaterfall", "HiddenCanyonRiver", "EmeraldRiverValley", 
  "SavannaSunsetLandscape", "AfricanWildlifePlains", "ElephantMigrationScene", "LionTerritoryLandscape", "NightCityStreetRain", 
  "GlowingMarketStreet", "CrowdedUrbanMarket", "SuburbanNeighborhood", "QuietVillageStreet", "EuropeanOldTownSquare", 
  "TrainStationPlatform", "HighSpeedTrainInterior", "AirportTerminalHall", "LuxuryShoppingMall", "FashionBoutiqueInterior", 
  "ArtGalleryExhibition", "DesertMilitaryOutpost", "BattlefieldLandscape", "DestroyedCityDistrict", "SunsetCountrysideFarm", 
  "GoldenWheatFields", "WindmillFarmLandscape", "StormyOceanCliffs", "LightningStormSky", "DarkThunderClouds", "VolcanicLavaField", 
  "ActiveVolcanoCrater", "MoltenLavaRivers", "HiddenJungleTemple", "SacredWaterTemple", "AncientStoneBridge", "FoggyLakeMorning", 
  "MirrorLakeReflection", "CalmLakeSunset", "HighAltitudePlateau", "CanyonCliffView", "GrandCanyonLandscape"
];

// ... (EPIC_SUBJECTS lista od 300+ stavki)
const EPIC_SUBJECTS = [
  "A vast underwater coral reef city glowing with bioluminescent coral structures and drifting schools of tropical fish",
  "A colossal ancient stone temple resting on the ocean floor covered in coral and marine life",
  "A deep ocean abyss illuminated only by glowing jellyfish drifting slowly through dark water",
  "A giant submerged shipwreck slowly decaying beneath layers of coral and sea plants",
  "A mysterious underwater cave filled with glowing blue crystals reflecting through clear water",
  "A massive school of silver fish swirling together like a living tornado above coral reefs",
  "A glowing underwater forest made of towering kelp swaying slowly with ocean currents",
  "A deep sea research station surrounded by strange bioluminescent creatures",
  "A colossal underwater canyon carved into the ocean floor with rays of sunlight piercing through",
  "A giant sea turtle gliding slowly above colorful coral reefs",
  "A surreal underwater cathedral formed entirely from coral and sea sponges",
  "A glowing deep sea jellyfish drifting in total darkness of the abyss",
  "A massive whale skeleton resting silently on the ocean floor",
  "A mysterious glowing underwater portal opening between ancient ruins",
  "A crystal clear tropical lagoon filled with vibrant coral and reef fish",
  "A submerged ancient city street lined with statues covered in coral",
  "A giant octopus slowly emerging from a dark underwater cave",
  "A deep ocean trench filled with strange alien-like sea creatures",
  "A sunken pirate ship surrounded by swirling schools of fish",
  "A glowing underwater garden filled with bioluminescent plants",
  "A colossal manta ray gliding gracefully above a coral plateau",
  "A deep sea hydrothermal vent releasing glowing mineral clouds",
  "A mysterious underwater cavern illuminated by shafts of sunlight",
  "A massive whale passing through a field of glowing plankton",
  "A hidden underwater temple entrance carved into coral rock",
  "A vast underwater kelp forest stretching endlessly beneath the surface",
  "A giant submarine wreck resting half buried in ocean sand",
  "A glowing coral archway forming a natural underwater gateway",
  "A deep ocean floor scattered with giant seashell formations",
  "A mysterious underwater stone altar surrounded by drifting fish",
  "A massive underwater cliff wall covered in colorful coral",
  "A glowing field of jellyfish drifting together through dark water",
  "A deep sea anglerfish illuminating the abyss with its glowing lure",
  "A submerged marble statue slowly dissolving beneath coral growth",
  "A crystal underwater cavern with refracted sunlight patterns",
  "A giant crab crawling slowly across the ocean floor",
  "A glowing underwater cave filled with floating plankton particles",
  "A massive reef structure shaped like a natural underwater city",
  "A mysterious underwater monolith standing on the seabed",
  "A colossal whale gliding slowly through shafts of light",
  "A giant underwater sinkhole descending into darkness",
  "A glowing coral labyrinth filled with narrow passages",
  "A deep ocean battlefield of ancient shipwreck remains",
  "A surreal underwater landscape with towering coral pillars",
  "A massive school of barracuda circling through blue water",
  "A glowing underwater volcano vent releasing mineral clouds",
  "A hidden underwater grotto filled with crystal clear water",
  "A mysterious underwater ruin slowly reclaimed by coral",
  "A giant sea serpent silhouette moving through deep water",
  "A glowing jellyfish swarm illuminating the dark ocean",
  "A deep sea exploration drone scanning ancient ruins",
  "A colossal underwater mountain rising from the ocean floor",
  "A giant clam slowly opening beneath coral reefs",
  "A glowing underwater river flowing through sand valleys",
  "A massive coral wall stretching across the ocean horizon",
  "A mysterious underwater archway carved through reef rock",
  "A giant stingray gliding over sandy ocean plains",
  "A deep ocean cave filled with glowing plankton clouds",
  "A submerged stone staircase descending into darkness",
  "A glowing reef canyon filled with exotic marine life",
  "A giant whale calf swimming beside its massive parent",
  "A mysterious underwater sphere artifact resting on the seabed",
  "A glowing coral tunnel leading into a hidden cavern",
  "A massive underwater plateau surrounded by deep ocean drop-offs",
  "A deep sea trench illuminated by alien looking creatures",
  "A giant jellyfish floating slowly through silent waters",
  "A glowing coral throne formation rising from reef structures",
  "A submerged ancient battlefield filled with broken weapons",
  "A massive school of fish forming moving silver clouds",
  "A mysterious underwater ring structure half buried in sand",
  "A giant squid moving through deep ocean darkness",
  "A glowing underwater reef city filled with marine life",
  "A deep ocean skeleton of a prehistoric sea creature",
  "A hidden underwater lagoon beneath towering reef cliffs",
  "A giant sea turtle resting peacefully on coral",
  "A glowing underwater canyon illuminated by sunlight beams",
  "A deep sea abyss filled with strange drifting organisms",
  "A mysterious underwater portal ring made of ancient stone",
  "A massive underwater coral tower reaching toward sunlight",
  "A glowing sea anemone field moving with ocean currents",
  "A giant shark silhouette gliding silently through blue water",
  "A deep underwater trench filled with mineral formations",
  "A glowing reef valley surrounded by coral mountains",
  "A mysterious underwater dome structure covered in coral",
  "A massive whale shark swimming slowly above the reef",
  "A deep sea cave entrance surrounded by bioluminescent life",
  "A glowing coral pathway stretching across the seabed",
  "A giant underwater pillar formation shaped by erosion",
  "A mysterious underwater artifact glowing faintly on sand",
  "A glowing reef plateau filled with vibrant marine life",
  "A deep ocean crater filled with drifting sediment clouds",
  "A giant underwater statue face half buried in coral",
  "A glowing underwater waterfall flowing down reef cliffs",
  "A deep sea canyon illuminated by drifting plankton",
  "A massive coral archway forming a natural gateway",
  "A mysterious underwater temple chamber hidden in reef",
  "A glowing jellyfish corridor drifting slowly through water",
  "A deep ocean valley surrounded by towering coral cliffs",
  "A giant underwater rock formation shaped like a dragon",
  "A glowing reef labyrinth stretching across the ocean floor",
  "A mysterious ancient underwater obelisk rising from sand",
  "A deep sea exploration submarine scanning coral structures",
  "A massive underwater coral dome filled with tropical fish",
  "A glowing underwater crystal cavern beneath reef rock",
  "A giant manta ray gliding through glowing plankton clouds",
  "A deep ocean sinkhole opening into total darkness",
  "A mysterious underwater artifact emitting faint blue light",
  "A glowing reef tunnel leading into deep ocean caverns",
  "A massive underwater reef system stretching endlessly",
  "A giant sea creature silhouette disappearing into darkness",
  "A glowing coral throne surrounded by tropical fish",
  "A deep ocean cave filled with shimmering mineral deposits",
  "A mysterious underwater spiral structure carved into rock",
  "A glowing underwater crystal pillar formation",
  "A massive coral city structure built by natural reef growth"
];

// ============================================================================
// 2. LOGIKA GENERATORA
// ============================================================================

const formatToken = (text) => text.replace(/([a-z])([A-Z])/g, '$1 $2');

const sanitize = (text) => {
    return text
        .replace(/neon/gi, "vivid glowing")
        .replace(/cyberpunk|cyberpank/gi, "high-tech futuristic");
};

const getMetaTokens = (count) => {
    let shuffled = [...META_TOKENS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(formatToken).join(", ");
};

const getAbstractTokens = (count) => {
    let shuffled = [...ABSTRACT_META_TOKENS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(formatToken).join(", ");
};

export const getRandomDicePrompt = () => {
    const subject = EPIC_SUBJECTS[Math.floor(Math.random() * EPIC_SUBJECTS.length)];
    const env = formatToken(ENV_TOKENS[Math.floor(Math.random() * ENV_TOKENS.length)]);
    let prompt = `${subject}, set against the backdrop of a ${env}.`;
    return sanitize(prompt);
};

export const generatePrompts = (customerPrompt, demoInput, selectedQuality, selectedAR) => {
    let subject = (customerPrompt || demoInput || "").trim();
    const arMap = { '1:1': 'aspect ratio 1:1', '9:16': 'vertical format 9:16', '16:9': 'wide cinematic 16:9', '21:9': 'panoramic 21:9' };
    const qualMap = { '1x': 'standard quality', '2x': 'high definition rendering', '4x': '8k resolution, ultra-high definition' };
    const arDesc = arMap[selectedAR] || 'wide format';
    const qDesc = qualMap[selectedQuality] || 'high detail';
    const randomEnv = formatToken(ENV_TOKENS[Math.floor(Math.random() * ENV_TOKENS.length)]);

    const outputs = {
        abstract: `ABSTRACT MASTERPIECE: ${subject}. ${getAbstractTokens(10)}. Geometric harmony, procedural visual system, ethereal atmosphere. ${qDesc}, ${arDesc}.`,
        cinematic: `A breathtaking cinematic film still of ${subject}. Shot on IMAX 70mm film, directed by a visionary filmmaker, anamorphic lens flares, heavy chiaroscuro lighting, dramatic shadows, volumetric atmosphere. ${getMetaTokens(6)}. ${qDesc}, ${arDesc}.`,
        photoreal: `A professional hyper-realistic RAW photograph of ${subject}. Shot on Hasselblad X2D 100C, sharp focus on microscopic textures, natural skin pores and material detail, soft box studio lighting, true color accuracy, no filters. ${getMetaTokens(6)}. ${qDesc}, ${arDesc}.`,
        cctv: `The most groundbreaking digital masterpiece of ${subject}, located in a ${randomEnv}. ${UNIQUE_PHOTOREAL_COMBOS[Math.floor(Math.random() * UNIQUE_PHOTOREAL_COMBOS.length)]}. ${UNIQUE_META_POOL.join(", ")}. ${getMetaTokens(4)}. Unreal Engine 5.4, absolute physical accuracy, ${qDesc}, ${arDesc}.`,
        single: `V8 CORE ENGINE: ${subject}, merging absolute reality with digital perfection. ${getMetaTokens(15)}, global illumination, ray-traced shadows, award-winning visual clarity, ${qDesc}, ${arDesc}.`
    };

    return Object.fromEntries(Object.entries(outputs).map(([key, val]) => [key, sanitize(val)]));
};

// ============================================================================
// 3. UI KOMPONENTE
// ============================================================================

export const getYouTubeId = (url) => { if (!url || url === "#") return null; const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/); return (match && match[2].length === 11) ? match[2] : null; };
export const getMediaThumbnail = (url) => { const ytId = getYouTubeId(url); return ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : (url || bannerUrl); };
export const formatExternalLink = (url) => { if (!url || url === "#") return "#"; return url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`; };
export const extractSys = (desc) => { let d = desc || ""; let s = { w: '', g: '', b: 'AI ASSET', t: 'LATEST ⚡' }; if (d.includes("|||SYS|||")) { const parts = d.split("|||SYS|||"); d = parts[0].trim(); try { s = { ...s, ...JSON.parse(parts[1]) }; } catch(e) {} } return { d: d, s }; };
export const SESSION_ID = Math.random().toString(36).substring(2, 15);
export const trackEvent = async (action, details = {}) => { try { await addDoc(collection(db, "site_stats"), { action, ...details, sessionId: SESSION_ID, timestamp: serverTimestamp() }); } catch (e) {} };

export function UniversalVideoPlayer({ url, videoRef }) {
    const ytId = getYouTubeId(url);
    if (ytId) return <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}`} frameBorder="0" allowFullScreen></iframe>;
    return <video ref={videoRef} src={url} className="w-full h-full object-cover" autoPlay loop muted playsInline />;
}

export function TypewriterText({ text, speed = 10 }) {
  const [disp, setDisp] = useState('');
  useEffect(() => {
    let i = 0; setDisp(''); if (!text) return;
    const t = setInterval(() => { setDisp(text.slice(0, i + 1)); i++; if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return <span>{disp}</span>;
}

export function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight;
    const letters = '10XV8PROAI'; const fontSize = 14;
    let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f97316'; ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const intv = setInterval(draw, 35); return () => clearInterval(intv);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-[15] opacity-[0.1] pointer-events-none" />;
}

export const renderDescription = (text) => {
  const { d: cleanDesc } = extractSys(text);
  if (!cleanDesc) return null;
  return cleanDesc.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-2"></div>;
    const upper = trimmed.toUpperCase();
    if (upper.includes('[DESCRIPTION]') || upper.includes('VALUE MULTIPLIER') || upper.includes('KEY FEATURES') || upper.includes('THE ARSENAL') || upper.includes('THE 5 PILLARS') || upper.includes('THE ROI FINALE')) {
        return <h3 key={idx} className="text-[12px] font-black text-white mt-10 mb-4 uppercase tracking-widest border-l-4 border-orange-500 pl-4 italic text-left">{trimmed}</h3>;
    }
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      return <div key={idx} className="flex gap-3 items-start my-2 bg-white/[0.02] p-3 rounded-2xl border border-white/5"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /><p className="text-white text-[11px] font-bold text-left">{trimmed.replace(/^[*-]\s*/, '')}</p></div>;
    }
    return <p key={idx} className="text-white text-[11px] font-bold leading-relaxed my-3 text-left">{trimmed}</p>;
  });
};

export function AssetCard({ app }) {
  const mediaItem = app?.media?.[0];
  const isVideo = mediaItem?.type === 'video' || mediaItem?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const displayUrl = isVideo ? `${mediaItem.url}#t=0.001` : getMediaThumbnail(mediaItem?.url);
  return (
    <div className="relative overflow-hidden p-[1px] bg-gradient-to-br from-orange-500 to-blue-500 rounded-[3rem] transition-all duration-500 hover:scale-[1.03] flex flex-col group h-full shadow-2xl">
      <div className="bg-[#0a0a0a] rounded-[2.9rem] flex flex-col h-full p-10 relative">
        <div className="aspect-video relative overflow-hidden rounded-[2rem] mb-8 border-2 border-blue-500/30 bg-zinc-900 shadow-2xl text-left">
          {isVideo ? <video src={displayUrl} className="w-full h-full object-cover" muted playsInline /> : <img src={displayUrl} className="w-full h-full object-cover" alt="asset" />}
        </div>
        <div className="flex justify-between items-start mb-6 gap-4 text-left">
          <h2 className="text-lg font-black uppercase group-hover:text-orange-500 transition-all text-white leading-tight">{app.name}</h2>
          <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[12px] font-black text-blue-400 shadow-lg">${app.price}</div>
        </div>
        <div className="mt-auto pt-4 text-left">
          <Link to={`/app/${app.id}`} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl">MORE DETAILS <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}

export function TutorialCard({ vid }) {
  const videoId = getYouTubeId(vid.url);
  return (
    <div className="p-[1px] bg-gradient-to-br from-orange-500 to-blue-500 rounded-[2.5rem] flex flex-col h-full hover:-translate-y-2 transition-all group shadow-xl">
      <div className="bg-[#0a0a0a] rounded-[2.4rem] p-6 flex flex-col h-full">
        <div className="aspect-video relative overflow-hidden rounded-3xl mb-6 bg-zinc-900 border-2 border-orange-500/30 cursor-pointer" onClick={() => window.open(vid.url, '_blank')}>
          <img src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} alt="tut" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" />
          <div className="absolute inset-0 flex items-center justify-center"><PlayCircle className="w-16 h-16 text-red-500 drop-shadow-2xl scale-110" /></div>
        </div>
        <h4 className="text-zinc-200 font-black text-[13px] uppercase line-clamp-2 text-left tracking-tight">{vid.title}</h4>
        <div className="mt-4 inline-flex items-center gap-2 text-orange-500 font-black text-[9px] uppercase tracking-widest"><Zap className="w-3 h-3"/> Video Intelligence</div>
      </div>
    </div>
  );
}

export function FullScreenBoot({ onComplete }) {
  useEffect(() => { const t = setTimeout(onComplete, 2500); return () => clearTimeout(t); }, [onComplete]);
  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center">
      <img src={mojLogo} className="h-16 mb-8 animate-pulse" alt="boot" />
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-orange-600 animate-[loading_1.5s_infinite] w-1/2" style={{ animation: 'loading 1.5s infinite linear' }}></div>
        <style>{`@keyframes loading { 0% { left: -100%; } 100% { left: 100%; } }`}</style>
      </div>
      <p className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500 mt-6 animate-pulse text-center">Initializing V8 Protocols...</p>
    </div>
  );
}

export const LiveSalesNotification = ({ apps }) => {
  const [active, setActive] = useState(false);
  const [sale, setSale] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (apps && apps.length > 0) {
        const randomApp = apps[Math.floor(Math.random() * apps.length)];
        setSale({ name: randomApp.name }); setActive(true);
        setTimeout(() => setActive(false), 5000);
      }
    }, 28000);
    return () => clearInterval(interval);
  }, [apps]);
  if (!active || !sale) return null;
  return (
    <div className="fixed bottom-10 left-10 z-[1000] bg-black/95 border border-orange-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-2xl transition-all duration-700 text-left">
      <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center"><Zap className="w-5 h-5 text-orange-500" /></div>
      <div><p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">New Access Granted</p><p className="text-[11px] font-black text-white uppercase">{sale.name}</p></div>
    </div>
  );
};

export const BANNER_DATA = [
  { url: slikaHubImg, badge: "CORE AI HUB", title: "Welcome to Our Hub", subtitle: "Command center for generating complex AI architectures." },
  { url: zmajImg, badge: "DRAGON PROTOCOL", title: "ANCIENT EMPIRES REBORN", subtitle: "Generate epic scenes with dragons in 8K resolution." },
  { url: novaSlikaImg, badge: "TIME TRAVELER", title: "UNIQUE PHOTO REALISTIC IMAGES", subtitle: "Merging historical eras using advanced AI engines." },
  { url: slikaCopyImg, badge: "CYBER STEALTH", title: "GHOST IN THE MACHINE", subtitle: "Professional prompts for high-detail visuals." },
  { url: slikaVideoImg, badge: "WARP SPEED", title: "TEMPORAL MOTION ENGINE", subtitle: "Optimized for fast generation of AI video content." },
  { url: hollywoodImg, badge: "WINTER PROTOCOL", title: "HOLLYWOOD VFX GRADE", subtitle: "Epic cinematic battles and CGI-level detail." }
];