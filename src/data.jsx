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
export const ADMIN_DEFAULT_DESC = `[HEADLINE]
Unesi glavni naslov ovde...

[DESCRIPTION]
Unesi glavni opis ovde...

[LINKS & FILES]
Whop Link: https://whop.com/...
Gumroad Link: https://gumroad.com/...
React Source Code: https://github.com/...
File Upload: Uputstvo za preuzimanje...

[PRICE]
Price: $XX

KEY FEATURES
* Feature 1
* Feature 2
* Feature 3

VALUE MULTIPLIER
* Benefit 1
* Benefit 2`;

// ============================================================================
// 1. MEGA BAZE TOKENA
// ============================================================================

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

// 1000 Camera/Lens × Meta Tokens × Unique Keywords
export const CAMERA_LENS_META_KEYWORDS = [
  "ARRI Alexa 35 + Zeiss Supreme Prime 35mm f/1.5 × UltraDepth_Field • NanoDetail_8K × cinematic optical depth",
  "ARRI Alexa 35 + Zeiss Supreme Prime 50mm f/1.5 × RAW_grain_lite • MicroContrast_Boost × tactile surface realism",
  "ARRI Alexa Mini LF + Zeiss Master Prime 100mm × OpticalBokehSignature • HDR_vision_fusion × hyper-real reflections",
  "RED Raptor V + Leica Summilux-C 50mm T1.4 × SensorBloom_v2 • SkinMicroTexture_v5 × photonic skin scattering",
  "RED V-Raptor XL + Sigma Cine FF 24mm × UltraSharp_GlobalDetail • EdgeFalloffNatural × spatial environmental realism",
  "Sony Venice 2 + Cooke S7/i 75mm × ColorScience_CinemaCore • VolumetricRayTrace × cinematic air depth",
  "Sony FX3 + Sony G Master 85mm × SkinPoreAmplifier • DepthCompression_v3 × portrait micro-detail",
  "IMAX MSM 9802 + Panavision C-Series 40mm × FilmGrain_TrueIMAX • SpectralLightCapture × monumental cinematic scale",
  "Leica SL2-S + APO-Summicron 50mm × LeicaMicroContrast • OpticalPrecisionDepth × glass-sharp realism",
  "Canon EOS R5 + RF 28-70mm f/2 × HDRDynamicStack • ColorDepth16bit × ultra clean tonal rolloff",
  "Nikon Z9 + Nikkor Z 58mm Noct × UltraCreamBokeh • PhotonBloom × ethereal subject isolation",
  "Hasselblad X2D 100C + XCD 90mm × NordicColorScience • MediumFormatDepth × elegant tonal realism",
  "Phase One XF IQ4 150MP + Schneider 80mm LS × PixelPrecision • MediumFormatHyperDetail × microscopic texture realism",
  "Fujifilm GFX100 II + GF 110mm × FilmSim_NaturalPro • DynamicRangeBoost × analog tonal depth",
  "Blackmagic URSA 12K + Zeiss Supreme 65mm × CinemaRAWTexture • UltraFineShadowMap × cinematic shadow realism",
  "Panasonic Lumix S1H + Leica Summilux 25-50mm × NaturalSkinTones_v3 • SpectralHighlightControl × photoreal skin physics",
  "ARRI Alexa LF + Panavision Primo 70mm × PanavisionColorSignature • CinematicShadowRoll × organic highlight bloom",
  "RED Komodo X + Laowa 24mm Probe × MacroRealityCapture • NanoSurfaceDetail × extreme macro realism",
  "Sony A1 + Sony 135mm GM × UltraOpticalCompression • PortraitRealismStack × lifelike facial depth",
  "Canon EOS R3 + RF 85mm f/1.2 × SkinReflectanceModel • OpticalClarityBoost × hyper realistic portrait texture",
  "DJI Inspire 3 + Zenmuse X9 DL 35mm × AerialScaleCapture • AeroSharpness × monumental aerial realism",
  "DJI Mavic 3 Pro + Hasselblad 24mm × AeroHDRCapture • HorizonSharpness × cinematic landscape scale",
  "GoPro Hero 12 + Max Lens Mod × ActionDistortionPhysics • ImmersivePOVReality × dynamic perspective realism",
  "ARRI Alexa 35 + Zeiss Ultra Prime 85mm × UltraDepthCompression • MicroContrast_Boost × sculpted light realism",
  "Sony Venice 2 + Fujinon Premista 28-100mm × NaturalLensBreathing • CinematicTextureDepth × optical authenticity",
  "RED Raptor XL + Angenieux Optimo 24-290mm × CinemaZoomPrecision • SpectralHighlightControl × cinematic zoom realism",
  "Leica M11 + Noctilux 50mm f/0.95 × LeicaGlowSignature • OpticalPrecisionDepth × dreamy photonic glow",
  "Hasselblad H6D-400c + HC 100mm × UltraResolutionStack • PixelIntegrityEngine × microscopic detail",
  "Sony FX6 + Sony 50mm GM × NaturalMotionRealism • DocumentaryLightBalance × real-world authenticity",
  "Canon C500 Mark II + CN-E 85mm × CineDynamicRange • HDR_vision_fusion × cinematic tonal fidelity",
  "Blackmagic Pocket 6K Pro + Sigma Cine 35mm × RAWTextureLayer • MicroContrast_Boost × raw cinematic realism",
  "Panasonic GH6 + Leica 42.5mm × HybridCinemaLook • UltraFineShadowMap × crisp cinematic depth",
  "Fujifilm X-H2S + XF 56mm × PortraitFilmLook • FilmSim_NaturalPro × analog portrait realism",
  "ARRI Alexa 65 + Panavision System 65 50mm × EpicScaleDepth • SpectralLightCapture × ultra epic cinematic realism",
  "RED Monstro 8K + Sigma Cine 50mm × UltraClarityEngine • NanoDetail_8K × crystal optical precision",
  "Sony A9 III + Sony 24mm GM × SpeedCaptureReality • MotionFreezeStack × frozen action realism",
  "Canon 5D Mark IV + EF 50mm × ClassicPhotoRealism • NaturalColorScience × timeless photographic fidelity",
  "Nikon D850 + Sigma Art 40mm × PrecisionOpticsMode • MicroContrast_Boost × hyper-clean sharpness",
  "Leica Q3 + Summilux 28mm × LeicaStreetRealism • DocumentaryLightBalance × candid street realism",
  "Hasselblad X1D II + XCD 80mm × NordicTonalBalance • MediumFormatDepth × refined tonal transitions",
  "Phase One IQ3 + Schneider 110mm × HyperResolutionCapture • PixelIntegrityEngine × extreme clarity",
  "DJI Inspire 2 + X7 50mm × AerialFilmLook • HorizonSharpness × cinematic drone realism",
  "GoPro Hero 11 + UltraWide × ImmersivePOVReality • DynamicMotionPerspective × action realism",
  "RED Dragon 6K + Zeiss CP2 35mm × CinemaTextureStack • RAW_grain_lite × filmic grain authenticity",
  "Sony A7R V + 90mm Macro × MicroTextureAmplifier • NanoSurfaceDetail × extreme micro realism",
  "Canon EOS R5C + RF 24mm × CinemaHybridMode • HDRDynamicStack × cinematic digital clarity",
  "Nikon Z8 + Nikkor Z 50mm × PrecisionColorScience • OpticalClarityBoost × balanced tonal realism",
  "Leica M10-R + Summicron 35mm × StreetAuthenticityMode • LeicaMicroContrast × documentary realism",
  "ARRI Alexa Mini LF + Panavision Primo 50mm × CinematicShadowRoll • UltraFineShadowMap × elegant lighting depth",
  "RED Komodo X + Atlas Mercury 36mm × AnamorphicCinematicMode • CinematicFlarePhysics × stretched cinematic look",
  "Sony FX3 + Sony 24mm GM × NightPhotonBoost • SpectralHighlightControl × atmospheric night realism",
  "Canon EOS R8 + RF 85mm × PortraitLightBalance • SkinReflectanceModel × studio portrait realism",
  "Nikon Zf + Voigtländer 50mm × VintageOpticsSignature • AnalogFilmTexture × analog realism",
  "Leica SL3 + APO-Summicron 90mm × PrecisionOpticalStack • OpticalClarityBoost × hyper clean realism",
  "Hasselblad X2D + XCD 65mm × NordicNaturalColor • MediumFormatDepth × refined tonal rendering",
  "Phase One XF IQ4 + Schneider 120mm × MacroUltraDetail • PixelPrecision × tactile macro realism",
  "DJI Mavic 3 Pro Cine + Hasselblad 24mm × AerialHDRCapture • AeroSharpness × cinematic sky depth",
  "GoPro Hero 12 + Linear Lens × ActionRealismEngine • DynamicMotionPerspective × immersive POV realism",
  "ARRI Alexa 35 + Cooke S7/i 100mm × CinematicPortraitDepth • UltraDepth_Field × ultra cinematic portrait realism",
  "RED Raptor XL + Cooke S7/i 50mm × CinematicTextureDepth • SpectralHighlightControl × cinematic realism",
  "Sony Venice 2 + Panavision Primo 65mm × EpicPortraitMode • OpticalPerfectionStack × monumental portrait realism",
  "IMAX MSM 9802 + IMAX 80mm × UltraEpicCapture • SpectralLightCapture × giant-format realism",
  "ARRI Alexa LF + Zeiss Master Prime 50mm × OpticalPerfectionStack • MicroContrast_Boost × cinematic clarity",
  "RED V-Raptor + Sigma Cine 85mm × PortraitHyperDetail • NanoDetail_8K × intense portrait realism",
  "Sony A1 + Sony 50mm GM × CrystalSharpnessMode • OpticalPrecisionDepth × ultra optical realism",
  "Canon R5 + RF 85mm f/1.2 × SkinToneSpectralMap • PortraitRealismStack × lifelike skin rendering",
  "Nikon Z9 + Noct 58mm × PhotonGlowCapture • SpectralHighlightControl × luminous highlight realism",
  "Leica M11 + APO-Summicron 50mm × LeicaPrecisionRender • OpticalClarityBoost × pure optical realism",
  "Hasselblad X2D + XCD 90mm × MediumFormatCinematicDepth • NordicColorScience × elegant cinematic realism",
  "Phase One XF + Schneider 120mm × MacroUltraDetail • PixelIntegrityEngine × tactile macro realism"
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
  "ExperimentalVisualArt", "FutureAbstractDesign", "ComputationalArt", "MinimalistDesign", "SurrealForms", "NonRepresentational", 
  "GeometricHarmony", "OrganicStructures", "DigitalComplexity", "MathematicalArt", "DynamicFlow", "ExperimentalVisuals", 
  "TechnologicalAesthetic"
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
  "CrystalBlueOcean", "DeepOceanAbyss", "SunlightUnderwaterRays", "KelpForestUnderwater", "BioluminescentOcean", 
  "TropicalIslandLagoon", "HiddenIslandParadise", "PalmBeachSunset", "CliffsideOceanView", "TurquoiseWaterBay", "VividCityNight", 
  "FuturisticCitySkyline", "FlyingCarCity", "UltraModernCityCenter", "HighTechCityDistrict", "RainyFuturisticStreet", 
  "LuxuryPenthouseView", "SkyscraperRooftop", "GlassTowerInterior", "LuxuryHotelLobby", "ModernArchitecturalHall", 
  "AncientRomanColosseum", "MedievalCastleCourtyard", "AncientGreekTemple", "AncientEgyptianPyramid", "AztecTempleComplex", 
  "VikingVillage", "StoneAgeSettlement", "SpaceStationInterior", "DeepSpaceOrbit", "AlienPlanetSurface", "RingedPlanetHorizon", 
  "AsteroidField", "InterstellarNebula", "GalacticStarField", "FrozenArcticLandscape", "IceCaveInterior", "GlacierValley", 
  "SnowstormWilderness", "AbandonedIndustrialFactory", "RustyIndustrialWarehouse", "OldPowerPlant", "AbandonedRailwayStation", 
  "UrbanRuinsDistrict", "ModernResearchLaboratory", "HighTechControlRoom", "AICommandCenter", "FuturisticLaboratory", 
  "HiddenUndergroundBunker", "SecretMilitaryBase", "WarRoomInterior", "SubmarineInterior", "LuxurySportsCarGarage", 
  "ClassicCarShowroom", "SupercarTunnel", "GrandRoyalPalace", "LuxuryBallroom", "RoyalGarden", "GoldenThroneHall", 
  "AncientLibraryHall", "OldUniversityLibrary", "SecretArchiveRoom", "MysticBookChamber", "FloatingIslandsLandscape", 
  "FantasyCrystalCave", "DragonMountainLair", "MagicPortalValley", "MassiveWaterfallCliff", "RainforestWaterfall", 
  "HiddenCanyonRiver", "EmeraldRiverValley", "SavannaSunsetLandscape", "AfricanWildlifePlains", "ElephantMigrationScene", 
  "LionTerritoryLandscape", "NightCityStreetRain", "GlowingMarketStreet", "CrowdedUrbanMarket", "SuburbanNeighborhood", 
  "QuietVillageStreet", "EuropeanOldTownSquare", "TrainStationPlatform", "HighSpeedTrainInterior", "AirportTerminalHall", 
  "LuxuryShoppingMall", "FashionBoutiqueInterior", "ArtGalleryExhibition", "DesertMilitaryOutpost", "BattlefieldLandscape", 
  "DestroyedCityDistrict", "SunsetCountrysideFarm", "GoldenWheatFields", "WindmillFarmLandscape", "StormyOceanCliffs", 
  "LightningStormSky", "DarkThunderClouds", "VolcanicLavaField", "ActiveVolcanoCrater", "MoltenLavaRivers", "HiddenJungleTemple", 
  "SacredWaterTemple", "AncientStoneBridge", "FoggyLakeMorning", "MirrorLakeReflection", "CalmLakeSunset", "HighAltitudePlateau", 
  "CanyonCliffView", "GrandCanyonLandscape", "VolcanicEruption", "DesertOasis", "FloatingIslands", "AbandonedIndustrialZone", 
  "SubterraneanCavern", "CelestialVoid", "MicroscopicWorld", "HistoricalVillage", "SteampunkFactory", "ZenGarden"
];

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
  "A massive coral city structure built by natural reef growth",
  "A monumental Rolex watch carved out of a single mountain peak",
  "A luxury watch made of liquid gold and floating diamonds in zero gravity",
  "Ancient Roman legion marching through a futuristic portal",
  "Queen Cleopatra as a cybernetic empress on a golden throne",
  "A futuristic supercar driving through a prehistoric Jurassic jungle",
  "An astronaut discovering an ancient Egyptian pyramid on Mars",
  "A samurai fighting a mechanical demon in a cherry blossom storm",
  "A massive Rolex Submariner acting as a portal in the middle of the Atlantic ocean",
  "A futuristic skyscraper built into the side of a giant floating iceberg",
  "A surreal library where books fly like birds in a vortex of light",
  "A transparent hourglass containing an entire miniature galaxy",
  "Cybernetic gladiator in a neon arena",
  "Nordic viking warrior fighting a frost giant",
  "Majestic dragon guarding a futuristic vault",
  "Hyper-realistic portrait of a time-traveling explorer"
];

// ============================================================================
// BANNER DATA
// ============================================================================

export const BANNER_DATA = [
  { image: slikaHubImg, badge: "CORE AI HUB", title: "Visionary Master Protocol V8", subtitle: "Command center for generating complex AI architectures. 66 million+ cinematic combinations." },
  { image: zmajImg, badge: "DRAGON PROTOCOL", title: "ANCIENT EMPIRES REBORN", subtitle: "Generate epic scenes with dragons in 8K resolution with extreme detail." },
  { image: novaSlikaImg, badge: "TIME TRAVELER", title: "UNIQUE PHOTO REALISTIC IMAGES", subtitle: "Merging historical eras using advanced AI engines for 10x fidelity." },
  { image: slikaCopyImg, badge: "CYBER STEALTH", title: "GHOST IN THE MACHINE", subtitle: "Professional stealth prompts engineered for high-detail ghost visuals." },
  { image: slikaVideoImg, badge: "WARP SPEED", title: "TEMPORAL MOTION ENGINE", subtitle: "Optimized for fast generation of high-speed AI video content." },
  { image: hollywoodImg, badge: "WINTER PROTOCOL", title: "HOLLYWOOD VFX GRADE", subtitle: "Epic cinematic battles and high-end CGI-level detail protocols." }
];

// ============================================================================
// 2. LOGIKA GENERATORA
// ============================================================================

const formatToken = (text) => text.replace(/([a-z])([A-Z])/g, '$1 $2');
const sanitize = (text) => text.replace(/neon/gi, "vivid glowing").replace(/cyberpunk/gi, "high-tech futuristic");

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
    return sanitize(`${subject}, set against the backdrop of a ${env}.`);
};

export const generatePrompts = (customerPrompt, demoInput, selectedQuality, selectedAR) => {
    let subject = (customerPrompt || demoInput || "").trim();
    const arMap = { '1:1': 'aspect ratio 1:1', '9:16': 'vertical format 9:16', '16:9': 'wide cinematic 16:9', '21:9': 'panoramic 21:9' };
    const qualMap = { '1x': 'standard quality', '2x': 'high definition rendering', '4x': '8k resolution, ultra-high definition' };
    const arDesc = arMap[selectedAR] || 'wide format';
    const qDesc = qualMap[selectedQuality] || 'high detail';
    const photorealCamera = UNIQUE_PHOTOREAL_COMBOS[Math.floor(Math.random() * UNIQUE_PHOTOREAL_COMBOS.length)];

    const outputs = {
        abstract: `ABSTRACT MASTERPIECE: ${subject}. ${getAbstractTokens(10)}. Geometric harmony, procedural visual system, ethereal atmosphere. ${qDesc}, ${arDesc}.`,
        cinematic: `A breathtaking cinematic film still of ${subject}. Shot on IMAX 70mm film, directed by a visionary filmmaker, anamorphic lens flares, heavy chiaroscuro lighting, dramatic shadows, volumetric atmosphere. ${getMetaTokens(6)}. ${qDesc}, ${arDesc}.`,
        photoreal: `A professional hyper-realistic RAW photograph of ${subject}. ${photorealCamera}. Microscopic textures, natural skin pores and material detail, soft box studio lighting, true color accuracy, no filters. ${getMetaTokens(6)}. ${qDesc}, ${arDesc}.`,
        cctv: `Surveillance footage of ${subject}. ${UNIQUE_META_POOL.slice(0,10).join(", ")}. Grainy digital noise, fisheye lens distortion, flickering infrared night vision, timestamp overlay, found footage aesthetic. ${qDesc}, ${arDesc}.`,
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
    
    if (upper.includes('[DESCRIPTION]') || upper.includes('VALUE MULTIPLIER') || upper.includes('KEY FEATURES') || 
        upper.includes('THE ARSENAL') || upper.includes('THE 5 PILLARS') || upper.includes('THE ROI FINALE') || 
        upper.includes('[LINKS & FILES]') || upper.includes('[HEADLINE]') || upper.includes('[PRICE]')) {
        const cleanTitle = trimmed.replace(/\[|\]/g, ''); 
        return <h3 key={idx} className="text-[12px] font-black text-white mt-10 mb-4 uppercase tracking-widest border-l-4 border-orange-500 pl-4 italic text-left">{cleanTitle}</h3>;
    }

    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      return <div key={idx} className="flex gap-3 items-start my-2 bg-white/[0.02] p-3 rounded-2xl border border-white/5"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /><p className="text-white text-[11px] font-bold text-left">{trimmed.replace(/^[*-]\s*/, '')}</p></div>;
    }

    if (upper.startsWith('WHOP LINK:') || upper.startsWith('GUMROAD LINK:') || upper.startsWith('REACT SOURCE CODE:') || upper.startsWith('FILE UPLOAD:') || upper.startsWith('PRICE:')) {
        const parts = trimmed.split(/:(.+)/);
        if (parts.length > 1) {
            const label = parts[0].trim();
            const link = parts[1].trim();
            return (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 my-2 bg-blue-900/10 p-3 rounded-xl border border-blue-500/20 text-left">
                    <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest min-w-[140px]">{label}:</span>
                    {link.startsWith('http') ? (
                        <a href={link} target="_blank" rel="noreferrer" className="text-white hover:text-orange-500 text-[11px] truncate break-all">{link}</a>
                    ) : (
                        <span className="text-white text-[11px] font-bold">{link}</span>
                    )}
                </div>
            );
        }
    }

    return <p key={idx} className="text-white text-[11px] font-bold leading-relaxed my-3 text-left">{trimmed}</p>;
  });
};

export function AssetCard({ app }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const mediaItem = app?.media?.[0];
  const isVideo = mediaItem?.type === 'video' || mediaItem?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const displayUrl = isVideo ? `${mediaItem.url}#t=0.001` : getMediaThumbnail(mediaItem?.url);
  
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.muted = false; // Ukljucuje zvuk
      videoRef.current.play(); // Pokrece video
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false); // Sklanja kontrole, vraca play ikonicu
    if (videoRef.current) {
      videoRef.current.load(); // Resetuje video na pocetak (pokazuje prvi frejm kao thumbnail)
    }
  };
  
  return (
    <Link to={`/app/${app.id}`} className="block group text-left">
      <div className="relative overflow-hidden p-[1px] bg-gradient-to-br from-orange-500 to-blue-500 rounded-[3rem] transition-all duration-500 hover:scale-[1.03] flex flex-col h-full shadow-2xl">
        <div className="bg-[#0a0a0a] rounded-[2.9rem] flex flex-col h-full p-10 relative overflow-hidden">
          
          {/* NOVI VELIKI DIJAGONALNI RIBBON KOJI IDE PREKO CIJELE KARTICE */}
          {app.type && (
            <div className="absolute top-12 -right-28 w-96 bg-red-600 text-white py-3 text-center text-[12px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(220,38,38,0.5)] z-50 rotate-[40deg] border-y border-red-400 pointer-events-none">
              {app.type}
            </div>
          )}

          {/* POVEĆAN PLAVI BOX (POMEREN IZNAD VIDEA UNUTAR GLAVNOG BOXA) */}
          <div className="flex mb-5 relative z-20">
            <div className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-xl tracking-widest">
              {app.category || 'AI ASSET'}
            </div>
          </div>

          <div className="aspect-video relative overflow-hidden rounded-[2rem] mb-8 border-2 border-blue-500/30 bg-zinc-900 shadow-2xl text-left z-20">
            {isVideo ? (
              <>
                <video 
                  ref={videoRef}
                  src={displayUrl} 
                  className={`w-full h-full object-cover ${!isPlaying ? 'transition-transform duration-700 group-hover:scale-105' : ''}`}
                  playsInline 
                  controls={isPlaying} // Prikazuje kontrole tek kad se pusti video
                  onEnded={handleVideoEnded} // Resetuje se kad stigne do kraja
                  onClick={(e) => {
                    // Ovo sprecava da klikanje po kontrolama videa odvede na drugi link
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
                
                {/* MALA PLAY IKONICA PREKO VIDEA DOK NE KRENE */}
                {!isPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-all cursor-pointer z-30 group/playbtn"
                    onClick={handlePlayClick}
                  >
                    <div className="bg-black/60 p-3 rounded-full border border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.6)] group-hover/playbtn:bg-blue-600 transition-all group-hover/playbtn:scale-110">
                      <PlayCircle className="w-8 h-8 text-blue-400 group-hover/playbtn:text-white transition-colors" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <img src={displayUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="asset" />
            )}
          </div>
          
          <div className="flex justify-between items-start mb-6 gap-4 text-left relative z-10 flex-col sm:flex-row">
            <div className="flex flex-col">
              <h2 className="text-lg font-black uppercase group-hover:text-orange-500 transition-all text-white leading-tight">{app.name}</h2>
              {/* PODNASLOV (KATEGORIJA) DODAT TAČNO OVDE ISPOD NASLOVA U BOX-U - PROMENJENO U UPPERCASE */}
              <p className="text-[11px] text-zinc-400 uppercase mt-1.5 tracking-wide">
                {app.category || 'AI ASSET'}
              </p>
            </div>
            <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[12px] font-black text-blue-400 shadow-lg shrink-0 mt-2 sm:mt-0">${app.price}</div>
          </div>
          
          <div className="mt-auto pt-4 text-left relative z-10">
            <div className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl">MORE DETAILS <ArrowRight className="w-4 h-4" /></div>
          </div>
        </div>
      </div>
    </Link>
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
// ============================================================================
// PAMETNI TEKST PARSER (AUTOMATIZOVAN ŠABLON ZA OPISE)
// ============================================================================
export const FormattedDescription = ({ text }) => {
  if (!text) return null;
  const cleanText = text.replace(/\[SYS\][\s\S]*?\[\/SYS\]/gi, '');
  const lines = cleanText.split('\n');

  return (
    <div className="w-full text-left space-y-3">
      {lines.map((line, idx) => {
        const t = line.trim();
        if (!t) return <div key={idx} className="h-2"></div>;

        // 1. VALUE MULTIPLIER (Uvek narandžasto)
        if (t.toUpperCase().includes("VALUE MULTIPLIER")) {
          return (
            <p key={idx} className="text-orange-500 font-black text-[18px] md:text-[20px] uppercase tracking-widest mt-8 mb-6 leading-relaxed">
              {t.replace(/\*\*/g, '')}
            </p>
          );
        }

        // 2. NASLOVI (VELIKA SLOVA ili **tekst**)
        const isTitle = (t === t.toUpperCase() && /[A-Z]/.test(t) && !t.startsWith('-') && !t.startsWith('*')) || (t.startsWith('**') && t.endsWith('**'));
        const cleanTitle = t.replace(/\*\*/g, ''); 

        if (isTitle) {
          return (
            <h3 key={idx} className="text-[22px] md:text-[28px] font-black text-white uppercase tracking-widest mb-6 mt-12 border-l-[5px] border-orange-500 pl-5 italic text-left leading-tight">
              {cleanTitle}
            </h3>
          );
        }

        // 3. BULLET POENTI (✓ kružić)
        if (t.startsWith('-') || t.startsWith('*') || t.startsWith('•') || t.startsWith('✓')) {
          const bulletText = t.substring(1).trim().replace(/\*\*/g, ''); 
          return (
            <div key={idx} className="flex items-start gap-4 mb-4">
              <div className="bg-orange-500 rounded-full w-6 h-6 mt-0.5 shrink-0 flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.6)] border-2 border-orange-400">
                <svg className="w-3.5 h-3.5 text-white font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-white font-bold text-[16px] md:text-[18px] leading-relaxed flex-1 m-0 tracking-wide">
                {bulletText}
              </p>
            </div>
          );
        }

        // 4. OBIČAN TEKST (Boldovan u belo)
        return (
          <p key={idx} className="text-white font-bold text-[16px] md:text-[18px] leading-relaxed mb-6 tracking-wide">
            {t.replace(/\*\*/g, '')}
          </p>
        );
      })}
    </div>
  );
};