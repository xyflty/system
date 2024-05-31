/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["exports", "echarts"], factory);
  } else if (
    typeof exports === "object" &&
    typeof exports.nodeName !== "string"
  ) {
    // CommonJS
    factory(exports, require("echarts"));
  } else {
    // Browser globals
    factory({}, root.echarts);
  }
})(this, function (exports, echarts) {
  var log = function (msg) {
    if (typeof console !== "undefined") {
      console && console.error && console.error(msg);
    }
  };
  if (!echarts) {
    log("ECharts is not Loaded");
    return;
  }
  if (!echarts.registerMap) {
    log("ECharts Map is not loaded");
    return;
  }
  echarts.registerMap("广东", {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          adcode: 440100,
          name: "广州市",
          center: [113.280637, 23.125178],
          centroid: [113.544372, 23.329249],
          childrenNum: 11,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 0,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@¢}\\IlCjOGMxkidYOSHQtbEXSTAj]fZANZZoĢÔMR}w|[lHUf[|QpYpKz@vR\\XVL\\NL~L^PTR|@FTPLVC@KRJdF|hlD`WpD\\Gp@vWFTLpRP`RlALZYBI\\TjT@[|JXcVZfCPNrKhNVIXFhU@cfSBGfG@XYlTFNZSRQr\\PJL[ZE`HTYC]HOTFpfAPNONYBmEOLTBLRaDMRWBIP[PI^aNQrSJVbKLDbaPQ@CN]AAZRHDPQPl@PpL`^F`XBPZ`FHL`ILJXDFdnL^^J@O]P@NUFPVVlJGPeTTTWTJXXJLdOPEZKHBfKXIJDX_NSPoMEF{@WKILyI_PIOOL]A[QSCcMDQBUOKeOKQ[QGMJQGiPGMRWGQLU[SgVEYcB]LWKMaecXYTaKWLMIGEaTM_IBIWQHKe_SJ@LgH@VQVWDCKeUaG{DYNGbiRKVGKPgBKmKBgQCGQMABUcCkBTMQiUOENy[OHJccLAQYAWOC]TQDSkiBOgEeSsTg]sEOUWAOU[DqI[MUJeGC[UICe\\PJPTBKQL]ZYUGCYOSRsnCLWb`RK_cGQ\\IIeTcRID_OUPBbITDDXQn\\BHH`@HNGLfLHNna@QTEd_HgK]B_\\K\\[JS@]keAUJIh@CkK@JkPBOc]@aMPaVG`Y^C|FF}OIB`WfOZa_MFsQMpcBWIE\\WDirYzLTAfYSUuKPi",
            ],
          ],
          encodeOffsets: [[[116086, 23320]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440200,
          name: "韶关市",
          center: [113.591544, 24.801322],
          centroid: [113.779323, 24.81941],
          childrenNum: 10,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 1,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@NCdTD\\R^BPKJP`OzJJKXL|@FEpNTO`MCWJIJJ`|dIBMLFLpH^@L\\VLXELWTGXJHElALN\\HJPRA@UiOFKMIUgXG^HJOXCRJ^]fFTNfYZZCTNDF^XJGVP\\AXJDMXDZNEMXJTTJCP^DPOJZ`BG^B\\PRdJdVZjGNLJ\\W\\dJXLFD]VLPKXXO^TRvJLVSZB`LRK\\[BWLSZO]iAIg[UgMKGJSCDOPBAeIGTIRaGK]CcVM@MXUCCPwD]C[MYVWMEUOBBV[TUf[TENRZOZaJBXWnQTfBeRXNCJ`tBTOXPZXTBL]X{C@rJZQXG^bRtfR`^HHPqhKVAXKV^HJ^bLC`MJATQXCfODEVY@OT_HUIoRAJ[AgMDZJIRHir@PnHfIjRv@`FNPJfRJfDPR`NN^Q`VTCdNTRDATjTF`\\D`GTSVRLDRKR@\\|RCZf@^N@fpPJGlAJLLf`CNRDdJH`rnB\\ONZHOC\\NXV@T\\L^EfLHJhNDRKXF\\SNmBaTHNSZ^DAfRPTB\\V^MPRSE@PVFKLAvORU@AfSHBRWAUPKOWFSTODiGQL_xYDBv[TKE@QO@BVJFkRaVQEWW[GF]YMeK_TGNUCQSQu@KYQ]ACM[GGMUR_BePoHQGAgNEaYPQUAITaFIQQAkPOIWJWA@VUNiWIPSBWQCL[EIOUDWOieMFOIGNQEawUHFRSNOVXPD\\TLfHiPKRN\\Z@DNSXNNqLlVINcMWDKVcNIXjdKVRQQcKQHYBuKEaPQUIDWM]_UkKKSASSYOELkILHKVGbUFQ]STeDBOiACUKM_FKOuBUISBqgMTH^CVwTS^QDW]QNFT[HqBSSOHYSOB]ZEhcRYGIL_AMzMNO@WXUB_ODrM\\DT]dNPSBIOFQQK[VOKW^KDcM_YScoOObcJCq_AWWJKQGPOJoaLmEJMMGCSOK@O_Co_WIK]]N[GOJgGGO[IKUYGGm]@YVKvcGQKWRIEN[EK@mV]NEO[FWZBpULN\\FhBPGNR^ENMZF\\_XiXAJQGMmIaYcQKuJS\\YHSRMJ[\\K_Y@YmqCM\\QAmXIP[C]KITWiOFUVYA]LEB]VWC]IIaAgcgOOQR]SYHM]qKCJcQg{I\\§eWDe[_HkVJFI`JRGrA\\QEaPCZsRDR_l]JilebKpDTtbNpi^GDWPX\\EXJTKTBTh\\FLPRGNPBYT_PIDSpSrPXNh@VNZ^JQ@EYNYlKvPXbVMTFRTV[VTDTRbXJpCHQT^VCEYZU`DXILQ\\STAbYFapsZDDjFDv@TGD_ZMvQBcGMdsCO^OR@TcI]AqLISS`YNNTICWZFPGAWNgrSBOPF@OkGOJi]oYJ]RKKOUAEOWICOJOKI@UTCQ[QEFKeWSBYe@SMEUJSKSLKGgsSI\\WCKTKJSlBPOB]dMNOBi",
            ],
          ],
          encodeOffsets: [[[116532, 24477]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440300,
          name: "深圳市",
          center: [114.085947, 22.547],
          centroid: [114.143142, 22.643377],
          childrenNum: 9,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 2,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@[IOecGQSNKKIf@FSXgMM@]WGFQGkOM@M_Wa\\PEH`_RMX@ZoDGNU@Qr[FSSS`_@@^SMGFcM]FOPI|KFSIFPKLcF@LaXwEKVULLTYFGQKHIa_IKJSGMWHCAeYQWCCOQD@OUQA]yaUkLP[PmTcj|oLUGgbFLENoIiHgNaXYVGpZlZzbJ¢@NKrITVXJJERRKHTRjAFKdXfBFZRNbCBGfBlAT[vhHZLNT\\Tl@ZFnT`DrURQHaJWG}LwLWTQdIfD\\RT`PvR`l@bYtsHkXOXAV\\h\\Tbv@`mNwK@AJOPq@GMqRGIcIG`ZLJNGR_DK^UAKVTX@bJ\\[`QIAaMEmRSACZWLRLDbmFWEGKiFSJCKkiU@IRUFKh",
            ],
            ["@@HRY`WDYQ^KLOZG"],
            ["@@ZM@L]NDK"],
            ["@@PMJJONII"],
          ],
          encodeOffsets: [
            [[116971, 23361]],
            [[116552, 22934]],
            [[116577, 23051]],
            [[116572, 23039]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440400,
          name: "珠海市",
          center: [113.553986, 22.224979],
          centroid: [113.337286, 22.160135],
          childrenNum: 3,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 3,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@YNYMqNEUcMG\\KPaECWLS\\QTWOÁQ]@WO{SS{UQQILSKHIYaI©ISJ½RaJOHqPUna¡baanXV`hVPrFxNP^J¸bfNPD`RVpVjBb\\VJpGXF@fWZ@SXSj@XL\\CTVJTCTZlDNPFvONF^IVLVbJHTWV@VpRjj~@hUJDMKQyIIcEcVJoOIJ[K@YQIJ[EUJWE[HAT]UMUBYQTKbkP_TKAWUPWqOGKyW]Bq|KChMRQl_@d[bWP",
            ],
            ["@@HPQ^iKPWdI"],
            ["@@VPrHfR`@VJCN^PAPcGCSiA_OwKWMKSRE"],
            ["@@`RMZiBMOTK@ORA"],
            ["@@BULCVTWCKJ"],
            ["@@LT`VkS@U"],
            ["@@MdQO`S"],
            ["@@DSHTK@"],
            ["@@FTVLBVMTMK_FOOZYFSNE"],
            ["@@^GHVVAIT_MQQ"],
            ["@@JG\\HEPWHGW"],
            ["@@FP\\ZdFDORB`ZDV[BUU[^aWKROIB{JO"],
            ["@@jLPZQT]JSGAaPECS"],
            ["@@OIVIHJMJ"],
            ["@@V\\UtUGJaKGHWPE"],
            ["@@ZJdCHdKH@GOF]RC"],
            ["@@NY@\\MA"],
            ["@@^PLTCNWGOJISoKAIl@RI"],
            ["@@UQC]`b^NFPOVKAQWDK"],
            ["@@JKGUTNI`KK"],
            ["@@vLEZ[LW[DU"],
            ["@@CTSAGW`F"],
            ["@@@Q^P]B"],
            ["@@VDITKW"],
            ["@@CMVGQV"],
            ["@@bHGJYQ"],
            ["@@@WT@HP[H"],
          ],
          encodeOffsets: [
            [[115981, 22930]],
            [[116790, 22617]],
            [[116973, 22545]],
            [[116444, 22536]],
            [[116557, 22530]],
            [[116747, 22378]],
            [[116547, 22689]],
            [[116736, 22575]],
            [[116496, 22490]],
            [[116772, 22412]],
            [[116654, 22566]],
            [[115859, 22356]],
            [[116453, 22449]],
            [[116611, 22649]],
            [[116561, 22649]],
            [[116931, 22515]],
            [[115882, 22481]],
            [[116894, 22503]],
            [[115854, 22446]],
            [[116394, 22569]],
            [[116412, 22466]],
            [[116636, 22645]],
            [[116437, 22675]],
            [[116744, 22556]],
            [[116432, 22633]],
            [[116866, 22489]],
            [[116303, 22746]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440500,
          name: "汕头市",
          center: [116.708463, 23.37102],
          centroid: [116.575361, 23.322231],
          childrenNum: 7,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 4,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@@R^hVPjJ®L\\JVVt|\\XTJhB_fBPNRnMZaDQl@XIVGtpxdtZND~XTVlUFFnVdfZB~ShDjST@PSFaMWP@RqZOBQUBORIGUYBSKSHGWFSQSYJWUKDObQTsGD[YS`WBUYSCsRqJkKWSEGSHQ_QIT[U[FIIgFaHQT]VCROAA[TGDcSEK_DIQ]ASKRQtQXk\\UDCGJNZVTP\\D\\SPcEaQY_SIUXA~KDOWo@myGmeKYJEMLiRF\\a@OL[AyJUKWgBSG@MVQCcIH]MHSUMFMMSGo][YDOUDWPAIOWITaSBFoUYbc~W@WXETN^MZSNylALMIGVM`JTTlRTdTJAPPCtZETMX",
            ],
            [
              "@@GH[CL^GTiKIYUIQDIX]F[OyKD_f_FWEYUU@KM@chKdCdD|CBOlKzPhGFUXLVSfVDVQVBdXCLNSJ@N",
            ],
          ],
          encodeOffsets: [[[119350, 23661]], [[119957, 24020]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440600,
          name: "佛山市",
          center: [113.122717, 23.028762],
          centroid: [112.949778, 23.004314],
          childrenNum: 5,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 5,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@QE@OQI_ZWFFNODFXsJ]zJTf^HV_^M]kfQF]Mi@FkBORCTOIsB_OCOaeKSeBOMMCkQ[DmfGHHG`PJrIlmH_hCWImQKSYEWkcpMG]WQaDGaS@JXK`ICCcMEIjYEHOMCCUREAOHsdaJWByLe\\e@i`[IugKBDVAAA@A@UIcaOVaSBaLAOmsYQjY@]Od[NSUSNKOGOJAOaOqGEKyMYAGMsVGSJSVMC[]OqEIOOZSIUHB]UEM[gKgDEGwYkIBsLeXkOIAQTg^ATVZx^F\\O@ZpZNK`J`SVcVIK[eIJ_GYTM^LPB\\XFHNYRbTZBHMJV`BJ^\\@J[P@MV^SFNMLPNLOVDYROTbZLEJYQSVGEW[YFSZ^Te`LPMFLVG\\RR\\~\\DlKDNZN@JhUNNXbBPNTACjMJNJRMPDLZTHLKXAJLdJ{`oREDrLTMboX¹^gXF¢yVPbMXDALJ`d^\\zNJXINUTG\\ZbExLBNZTbNLPOjvLTVeZSByKqZCj[XJFAXodRNEt`NYbeP_XAPJE~{E]D_ZUHObbN^@PdOAIlL@Dlg@IJBVlf@^IT[\\[LA`L^Ghc`SF@RmbGMeKHKGM_@GG[ARmCWSCaJOAPVC`QJSdJf[JHR`dQLa_KXmDQtPTDZVHYZK^LRSAIO[ODfVJD\\",
            ],
            ["@@BBEAB@B@"],
          ],
          encodeOffsets: [[[115687, 24027]], [[115497, 23554]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440700,
          name: "江门市",
          center: [113.094942, 22.590431],
          centroid: [112.676451, 22.284348],
          childrenNum: 7,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 6,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@WS@MSSNKG[YC@XKBQY@fWQQJcAauHKM]LOMYWYYOaJSCKcbKFO\\E@a\\OBYUOIe^kY_WGP[X@J\\BHL`ABUhg@SbANGNJVUL@Xe\\C\\H^IHU][JkVDKO\\KrITOFUnDhQJYNGTaBoLBC]LGEaIQ\\IZScYN]a_HMeYLyMGY_SMLWMeJSNGRJ|D´jLNX²XZOhStqZMpEALZL¢ª®|vtPHARGlnROdIFx^dZ¢ÆTlJlDtG^cxClJVTVzRTJTJªZbGJTLJKRR|VTTP|@XR^PÂSX[RKTDXbFLOH[dNFVrMZNZMKf@xUhKf]l@@S`yvD\\GlQ`gp@fNhN@S\\BP¡zWE]hWºapSNqKCQF_p|cIIKWBKLSGKYOCQNMINIDiSBOMaAMWVMIgM@MYLCCk}[Q[[QUHEKON_KSfY]ET\\ZFXUHRTIZKFaYPSZQUCKPOMNKEM]TNUO@I\\[@I]_AIUGNYAaSZQGMWEA[KO]SNHZI`fJL\\UJUd_T_IMLoY@Y`aEUVOLUAgVWLgaQmKOMWAM`]LK\\JPD^]^NJKJSCMOHQ_WLOCSMBCaKOS@AaOiLKUCCPiLCKXALWcJKIYRPTELgFKYJEKYJeKUsIeSJgSmS[McPeaA_Q_LOMJ[MOFW[JEXMH",
            ],
            [
              "@@^TXITYVAPNj`^OlOLLnPRNbNPLRPBncCcLqSSDMSU@ORIaL[OKSDqMaOaiJUMKPQ^ANK^JJXRAdUI_oK[gOaJWRDXPEy\\JFIQS\\S",
            ],
            [
              "@@NPRI`HAJaLFNlX^KX@HOXLVIFRTPFRnALV_HSR@ftVHTKhMIONcQkGcSEaaGYMDQPGBMiYKLSUUBSLE",
            ],
            ["@@V]V@HXPLCjOFQa]S"],
            ["@@TDG\\KK@S"],
            ["@@TBTN@RgJkQJWbA"],
            ["@@NN\\@L\\M\\kEaSZgLC"],
            ["@@VX[CFS"],
            ["@@XJ@PeBCQRI"],
            ["@@CNOITC"],
            ["@@ZLHTUCYQNI"],
          ],
          encodeOffsets: [
            [[114858, 22923]],
            [[115482, 22082]],
            [[115232, 22102]],
            [[115134, 22184]],
            [[115385, 22219]],
            [[115593, 22113]],
            [[115739, 22373]],
            [[115361, 22115]],
            [[115291, 22105]],
            [[115379, 22130]],
            [[115509, 22082]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440800,
          name: "湛江市",
          center: [110.364977, 21.274898],
          centroid: [110.109828, 21.047893],
          childrenNum: 9,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 7,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@@xM_FSIikmb]JbB\\NBRZZGENXJELXdURBLWIOJOnBZUF[Z@R[NIGKPBTRdERfGAX@@DRYdYEMXLdQVIM]NIGMLSCWPN\\AJVBHL_ZSCFMMIM`LD@ZMB@bQAT`iRGT~PEXMDK_IPKMeRDLerdREtTZKTH\\NBPJALWFDP_Q[JDP^EMRSMCOMJFTPDXENXJTY^GVTUzKF[GeDWE[JW\\kXMuUFe[eEsRDLuBGLiKUFQ_Qf[DYgBWM@G`ICSgyOaZ_@_LAJgAMYgRIOWBKUWJIISH}Q_V_gSBmOBUeREMWRGceYCUTUUUFQWq@UJC[WBUPBROpWC@UQYGcMIEkVeCIDkfqBq^aEWrC¨AVW]k}MEsGÅB[YFWJÕAKQ¡O]@QNSµQåAsD_Psz±ff±FX«JGzJ`MT]VuCJmPa`Y¢]R[D[EiSckOGS@_V]mZmDO©HW`OjJfXdpPFF¨FLCzEnDpRrnFhIPSVVDlPx|ZJ`GjDVLb\\ Pbt~r`HNLIdoo¶KMviqQ}@gX\\DV@EhUnqR@mQWHq`oBOPcrM^CHjDlplFLKjDVP\\NAAYbu\\NDr¢¤^LnB^JVPXdJDXOZLR`ZJFZOV@TNFTdJVRTBnUVCzNÂHfX",
            ],
            [
              "@@@@LSOQYDQcL@MSLOJH\\M@Q\\YVEAYPmPIXJAKVQWcFKWIFMYHQYMAA[a^InajlTJ`EN@w^Z|rzxjxTªIChDlNlXvfWv_VWCQLCKaCQ]QXYP`NARUR[DNLEPD\\QPSScE`TM\\AVg^MAETPRQRG^eGCbLpAZWB]^U@MYIB[YB[NGHcUEESMCCuV[OEBM]FFM\\eOD]EJXINCDYM_NKQTIL_IEcRQMBZYC@eoCWdURQMYACbeG_gH[MIKL]@@TSB",
            ],
            ["@@dLYDZDBdvHDHqHKRYDQIecXEXc@M"],
            ["@@CgTCD^SN"],
            [
              "@@|JPNl¼Xl`\\H^ELeGSS]EKNu@UgfUFYWcC@MOMoACSJO^AX_tU\\HRIRoVBFOIOLWVI",
            ],
            [
              "@@gEeYg@s`i^]F_E[cAKTm@mOg[OaOKOMmFeZ@xX~FVl`FzC`JvKdH`CLGnLqVQ\\@TNF^CpFvl¼AZURgPYB",
            ],
            ["@@OKDCRBEN"],
            ["@@^AHNHQVJGfUZ[GCWOGJ["],
            ["@@IHZ_@IGaoeaE[JmXWtGpFTVZzXfAf"],
            ["@@PCzBVOTU}eo"],
            ["@@AQnELXgHOG"],
            ["@@BK~GDVWPkQ"],
          ],
          encodeOffsets: [
            [[113301, 21737]],
            [[113161, 22007]],
            [[113046, 22432]],
            [[113031, 22307]],
            [[113199, 21590]],
            [[113170, 21585]],
            [[113372, 22044]],
            [[113056, 21175]],
            [[113301, 21439]],
            [[113211, 20816]],
            [[113071, 21668]],
            [[113045, 21611]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 440900,
          name: "茂名市",
          center: [110.919229, 21.659751],
          centroid: [110.958736, 22.008884],
          childrenNum: 5,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 8,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@PL^EANPFU\\DvNDFTVFGdMHA\\\\ZJANZV@^]XABYKoDafHH]RQOQFSNBh]BUN[_SdFTTROC[FOMK\\CVQBQ_MZORWR^bDDLRKXD`UXupXjvT`HFPC~LrAVvFZRtH\\AJO[c@WOEiREENY@kLEnN`^N@lZpd|\\L´\\NTARWOJSIDRSKEJJZMNV`MHI^B^JDDZPRCNXbSryTYAQPD`LL]dZL^fl`K]J@NyAMDI^mE_ZIVQGi\\EbNXUb@hHLGRH\\fXCdODUbFTXLCLL^ZCGL^^EVZJFVQZFdMXjTLXOf^n`RJCNVZD`TLTVDjILvJLIPRbEF^JZADLbTLb\\OXTTEhVfKVLLdTE^ZfpTRhlHZEZC^MNoI[JQPK[GVLZK@FZQ@DRINUDuUUWDKaKBcigc\\iXc]PUGIN]Qes@K[eCGJH`WVAdIJNXFjUHeKULoQW`QMSa]I^JXRLPp|DHPoZ@VqXsEGK}DGRe`UKWDY^cJA\\MJQnTP@XYTAL_FES_A_uWAMcqCEJcMY[SRUBcIDUGQaQLDkUQSAaJMIiDcMQMAWMCK^]\\eIH]EKYIRMEWNgU@SeASPYKW_EiJMPUHIIT_BQZCNSBgOWLUAsZSJNZIRaA_VIZc@WZAHOIKuKgN[\\GAQaaKA[QSkEUOM]L_XGV_H_Q@IMODIOoUQR]COPHhaDsXBSgSi@MLNH{pM\\m^aDIIB[WEOODQWKKDw|KYIBE[QKBWPGdaR@HMC_FU]C@OPI@QMAHYEeII`ODH[MapQ^cRJZCLQrGCGuGAcYCZCcKQ_VyUS]HSZWIFMCWSOENIDPTNNQ]FCO\\I`RCOXEBKOIBATMC]SDGGSYFscQfqCKfQLNJOL`NCFW}OHSjQS_RB@aNA@YKCN_NJENTD`YGKUABIM[XOTDNKJH^MJNRUKcNWZFZcCQTA@S^@LKNJG\\`hfHDaZBRNVQXcpD@fZDAYRNdQJFK`SJLR`MZN",
            ],
            ["@@BWeHFQZCPRKT"],
            ["@@DhABMAG[LSHH"],
            ["@@QAJMIW^FPC[f"],
            ["@@TTBVUQ@W"],
            ["@@NTK@AS"],
          ],
          encodeOffsets: [
            [[113364, 22038]],
            [[113161, 22007]],
            [[113029, 22287]],
            [[113375, 22037]],
            [[113854, 21884]],
            [[113136, 21962]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441200,
          name: "肇庆市",
          center: [112.472529, 23.051546],
          centroid: [112.210411, 23.536359],
          childrenNum: 8,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 9,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@y@KNEhN@AdcAS^]@MNDftZN^G`WLSIOFMMIHJ\\_O[\\LNFXUGCL^\\bvYLqKO\\NrGFJZ_@]RgCLR\\TEhNLMPhrMLPRBRUXA^KB[TcQmF]RgH[VOCEXyKgLIrILXTUv@RSXFbULHRMfoNUIFRQEaLCZNPKZLHGRPNBVZfL|QKNiEWnSFObQDWhJmxYCeTGUR@agM_HAGJ}MWBgM_[FcCEkegwKESQCSHGX]LM`OLQ@gzeFS[IAEkQOJeIKaGcDSEEXONQdaXe@mAOWNK«`YBQSy@aJ]LEAYRSRo`Q@sfqmO@DQ[FWEMO[VWBE[N_W[MNa@@OSaHWNGGaJmSGGk]RIMaAQN[CMPOCeNIXcCEe{dSAAWOMFGO[CUUDB©UCFQMGYFMmGOWDKWCUcBgOC[LKIGNiWYNYS}IkBGiL[@MCG_DU_kIWOBYgIAI[{F@YMSFQYRQE]UMI]QUE[HUTI@JdL`SZ@j]GK`KFO`MjT\\CTLHbPJGZPDfupwFcOUuOQ[LOgfI~B\\IXiLKpGZF`Mh@vYbIEpBpT`EPM^KnALPAXSHmRSKTQX@N`VhO^FUt@~JjT`MVABM\\U@UQYaAKeSeHeEGZSYsAQQK\\cMOGHQI[PLWCkGORGXPPETHXGC_IGGeDQ\\]CsTBbgYGOYZExBfNTCCOT]lJxZFHhChLN\\VFA^VGTJPYJPrF^PD\\UNITHTtUHNZBzNFLrHbPBPPIPHMLVTMTc\\^PZ@RitZPnKBAbbTPUdbVJFBCULAvh\\J_@j[fKfAzIXcbGtBPQFDVNDGPZFJiNFDdJDL_IWT@HbbCXRH^oNldFXTZRLJnXgDG`knqJOIH_GGeHCnR\\DlNNAPTffLPbPDA`JtSPQDAP",
            ],
          ],
          encodeOffsets: [[[115539, 24111]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441300,
          name: "惠州市",
          center: [114.412599, 23.079404],
          centroid: [114.507032, 23.234461],
          childrenNum: 5,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 10,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@fJtdRRHEdUPPTìPTDR\\HlafMFIYsK]JO]CiXYFcI]Rq¸FL@TkCyJVLDNG~Bn\\vNP|pp^V^dJE^YXEXY\\JhME]LGVkNO^LNAfQPQCGTHRMT\\BDP]Z@VQLZ\\bANRZCTZTGXHDVVLT@p^JE\\v\\DAHVP\\UXZfKdYDT^XD^^\\\\JRCfXLAfPLX^VGNzHEnKPHTGTDZVFdEJLRGXVJpXX^b@CVNN`CKP_NCvMXUBM\\WEEJ]FERULo]ObHhGDF^UGcfYRqOIR[AaMOFOG[JOGBQWKaCeNQO[GYWQBQ]QBIUO@aRqF@OUUIc[CMPJ^IESZ[FL\\SNiWU@FmHAOe@kagHQgKGc_WDWNSWYMW_LMZo`CL_DGbHXNHMb@TM@ARSJV^Ef_DM\\c@CLMMAVUTHVmNLDElOH^VkTiGKMMRC]eVTRrTPjJDT_pF^ZZMX]E_LKxaMCOWBCiaPHPSVcRIEUT@R[VFLMRNdWR]UDOjeTiJ__REZ_AcSJSg[VDX_HEhVjMLAVQBKpHj\\\\XFSRHTeZSMeE]^QIWDIP]GWHVhNJELjP@VQBIO[GKMkBGFWISHKXWFUKK[]@oGEKKANcJ_{IILWAeLGFYPOKcWIIWXSSSfSHOkIUUEOMVO@P^I@]]mKEcWCKI_JGK_EOYWAE__]KOok@ROCOQGBY^BDMR@bOCaLKUaTIRqbMJ]\\OJOXANQbCKQSAPKnFZAPMOMeBEoPS^GZDGSF_\\YIK[ORqTQMYSEZk@WeHAHeT@dgVWEJMULgMqDOYedUIW\\{S@SiJ[ZAKYkB_QQOKoHQ^C\\Tf[VHMrLP@bWNSbQhBhZbHpMDaVefU|oBKWJ]}PBLOdGFIhVHNfQXBTMDcYSDsb[`EHMTBBKQ_MGOLKKHcCiFCCoIGLgVEJQV@ljDLTIjEHLXFnECaQKXKDYTBnQNFBbRJ\\_I[@aSWLUVBL]`CHQIMYKH_dJHJrQHNr@PO",
            ],
            ["@@P[A`gTFYTB"],
            ["@@RL\\@LPuLUCRc"],
            ["@@FQJPOB"],
            ["@@@S`XSFKI"],
            ["@@AULAIX"],
            ["@@KVCOPE"],
            ["@@T@R^KBY_"],
          ],
          encodeOffsets: [
            [[117263, 23205]],
            [[117403, 23116]],
            [[117381, 22988]],
            [[117361, 23215]],
            [[117597, 23053]],
            [[117401, 23220]],
            [[117481, 23120]],
            [[117393, 22968]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441400,
          name: "梅州市",
          center: [116.117582, 24.299112],
          centroid: [116.084478, 24.201791],
          childrenNum: 8,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 11,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@JPPEjrBN\\RhFFMZI\\[hGXBPXD|VRMNFNEXPGPRQ\\eZCVdEP`\\ABJnZARbB`O^TAfHZGRhEDDaXDNdLRIHjLJVKxBFQPVK\\NEXb@^QbZXnQRR\\jTOJhK\\@b\\nTTN@\\ZlOJXXTXKN[XHL\\@Z`FJLObj\\`ULdGTHtETcAGHCpNTSRAXYTBRNTevWIGbKDO\\OHQ`DVX@PRWbadeYFNiXY`E`QB[XAVVNMfjjLXXRA\\\\PFT[poBqqWXAMSUHmAaM_GEOOByZSa]OAOcQoOgVF|JNY`G]hcB[KSBQhgRC\\HVYVMbUG]bF^fSZ[HBj_@IQYBWYBQIe[E]Qc]QEu@[MeNLZXT@JWFSIOJAXSXSHQhUCy{[CoNiCIUM^]EKTWDOTI`_^OHWScHQ`]COJJW\\eIHOFsfUFO[SkCWGJXB\\SDKPePWAU[GgDUUG[HROKQLOUEC_KKBSQUXeWWO[@[^SEaXO^@LHNOEWOGBMeDcQdITeEUTIlupe@OPMIM@kHsa_MsGSJmFOdRLC^[hUDUP]EKPiN]W_@OJEZQV}QOK@S]cPqiONMcBJ]CMLeIMNeXGVB\\ERS`FE_RPVBLMASdCGQ[QC[RKBUO_cSMuDuNIH_PEG]TIFYGO`]AY[@MMFQCmOGKLMOYK@[NQqZKPWENYES\\mUEXE@QVKJ[OUaBILOpKKUBGNBZOASWSIMJIKNWUQQwWQR[h_AmJGEeLSBay[aEFUUWFeYYB]UCEYMEJ[mQD[KSZ]WGPOSSkRGnEdLldXQ_iJ[`URAA_GGZOpPDLPEHUK_BaGAMgQICCeRSAS\\K_kEeR_QI[@CWTA@]NBPkI_f[@[LIG_PQVC~JLTCXHNIJTVR@@NbPdEj^``CJXFRFP^Ad^PJAC^hHT`dRPMNaX]TGVBFT^DPIbDVONRI\\ZHNVKFTl[fTD@PORf|``vEFWZWhQDKbVRCbHV\\R\\ZjCV[KOTQfFbQ@NbEDMZSXGNLXO`HdO^AZZDRVHGVSLLbCV^Bfb@b\\TRAGSzAVdLNGVV\\L`CF]XMJS\\S",
            ],
          ],
          encodeOffsets: [[[119162, 24303]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441500,
          name: "汕尾市",
          center: [115.364238, 22.774485],
          centroid: [115.53778, 23.004558],
          cp: [115.53778, 23.004558],
          childrenNum: 4,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 12,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@WEDI__i]cFaO@MQ@SUJIGMDWKS}IGcJmIKvIWOcGSBDWOMNI[QOD[INKY_BWLO_DMMDUa@W]WIoWUQHIKcFUECYHSGSLOFmyGHM]UKWeOKBeWQD[I][C]]WCScZeLWY[VUOBG[C[uIFo]S@UKCUWGSHSYYDMQaBY[RK@U^YCO[ANSGQHSRDROBeKMP]lMHU^KNFIgZ[FWZWF]\\PIXUH@VTPhFCbH^XN^FrDxTlBN]ZW\\CLFA`QRLfRF|HbC^KuaGgNK¤NtBbCXIJQFsGcR]^Y\\GDS`BAZT~Hl]^A|ghFDM^OPnaXFVlzfPBjKB]Q]RqGOLJXrhTfFp`\\dlLzCPML[CbGwLUD_EkBcVU\\EVH`^dlj^vDh\\ZDRORBbbl\\ZBzZdH^AVQNYRITB`X`HTTNBlbb`VbVLZ`EZYAYLcKYYHiaMWHQVUQ]AoVK\\sJyfQIYXEQgUGZWJVPIfSiGP_AJbO\\RFGL^lKJY_eX^ZZMJ^XREL[P@JYBD`gdFVMBO\\SH_SeC[eeZBVVOLUhcBSPwbPRELPZ\\cJnMTAVRPT@|J\\AjTM\\w^@nJ`VDNRQXolS^G[SoAQ[a@KzDXTZsZSTCTiXUfOD",
            ],
            [
              "@@@[QOPMzDZMlFERINgD_smkQMLSMBUjYvK|BLr^d`Zd^|DTQ¨[|ILi\\uH]AsD¥Q",
            ],
            ["@@RROHAY"],
            ["@@BL]NOMlK"],
            ["@@VCCLQG"],
            ["@@B]TeyzYpE^PXZArQn[ne^qDE_YM["],
            ["@@JcPe^cbQzHDt[dmMIU"],
          ],
          encodeOffsets: [
            [[118382, 24036]],
            [[119573, 21271]],
            [[117871, 23318]],
            [[119538, 21192]],
            [[117951, 23284]],
            [[118726, 21604]],
            [[118709, 21486]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441600,
          name: "河源市",
          center: [114.697802, 23.746266],
          centroid: [114.962729, 24.043541],
          childrenNum: 6,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 13,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@AXZ`ML\\JPC\\RMJPNCXTAdHXPuJJLInHdUDORH`KJ@\\e\\J`OlMA@^SBDX\\@RJQ`Ff`l[LBTQTDfDRJNhHBAbL`GVOFCKoOYPHHB`QB_VI\\`jWRkccKmFQHlTTOPXHY^LTC\\nRI\\NFFZVDA^ZZEfVXEVbFz\\AbKTFfIHBng`Q\\XRRxVRMXJLNITJTXPBAYHMVALLPoJKbAPVI\\UL@RWFVF[nFTMZXFLOrYMR@\\ZLNPLKPHDnERNN\\@BZ_^HPEZSJH^OFG`MJCvNvdTP`AVQLD\\\\RHRcDBTKNUAQOF`_EQT[FUAWHMfJNKfDNI^dAMNjPOr^d@TPL~RBdIVBXkRWVJTGJ_ACRSRHNcRGX[L]AvWCWaa@SaBcIIg^cA]TyGQIUiWF[QSFoYaCH]NIuFYKOBSQY@IaQNMGchG\\SE@N]CGNSWBQ_UKQaFINWKY@aOMSeG@\\cDSKG{MSF]OaAQMCEW]MMJO`J^YJ[KKOmbOE_VWMaVmO@aLSEOJSU_QJYyKV[DO`Y|wY[JaW_uiJQIaJYbsgGUgeSQC[YMVWLQGJhEVYJG^J^Y@ERYVYGYJMMOF_KD_aKI]]GLUBWLUrgGO]GQ_seaQH]RWIY@q|D^WAKWSOYPWAS_sDIWMfQeARSXmAWbIPYQYFM\\SVe\\SAUPAFVXNZU\\N^DxCDOVDNWN@dU^DHLQbSJJHBfOACPTDHINLVhh\\BJjP^TYXK\\AL[KQA_TYKUuISQP]WWOLUKC^KEIW[c[XKIHMYicUcIOQA[H]_AIYOP]CDOSIISNWMFCYNWICBWO[HUWIE]MCDSYYGSTQWE[[GiLoRABUNKUiFg`GCW\\UThTId`BFY`Q`jIfSPiVC^XQMcNQEK\\U@QVSJFdQTUGObODjXADPbNLw`K^FNWYYE]`oCSiISOqSQfUD^NQLNjHlS]UPGFkKCnMGUVSBUNNDKd@N[`CFeU]TIBQN@@SNaMGGWHa`CDKp_NY`KNXXZMTCX`XHdhLGRbh@lPfGBEnV@jXTMK[\\ETYJFI]NO\\DJdVV@PrEbQP@JVRAR^RAZX\\HRPfMbDXLARPH\\IPHPEbN\\BJQrPZQdeVHE]HCGgPap^VKFQ^EFIXFN[VANWDu`M",
            ],
          ],
          encodeOffsets: [[[118190, 23802]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441700,
          name: "阳江市",
          center: [111.975107, 21.859222],
          centroid: [111.779569, 22.02617],
          childrenNum: 4,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 14,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@ITNfKXTNZ`NHKzfZGNb`M^dZYT[JJRFbKHD^KAApSbMHIZgRmCEVSPqJ[LLPUCIl^\\GV]J[G[DWfK@UVMIMHaB@TghAV_BGK[A@IWO\\XHZ`]lJfVPAZ[P@b[FEPaLLdTDbIZPXZNZKPN^GLbvdBRIXR@eRZLA@WZDH\\MLTT@NXTG`g^QSqPmFQHI^[b[BU\\kLBZIL[DWZ@T]Nb\\DRV@\\[JeSNc[O]W[IBYWCUuREOUTqHAVYDTVTGLNXMDXOPJP\\BAvOAWdSFBRMBCO[IBSUUEUPWYMceGWaO@KuWe}D]OkmmU@FYGYgkSQeo]YSFKcUKeLgUSFWS[PKaaSCKYB]IFEQaJOIKKuiJUCKS_SYCMUID_Q]mPeKWiSNWEcRYEUYIFU]]HKYDK]DKWKESVaPCDceWG[HQGK@gVaMWFaj[RHJU`YnFJ]NCzB@M^ILk_]eYK^cKKC_ROZBzSTqWaDMOQCYICA]J]NGU_NMIYFITLCQTJPIXBQMSp]fBl\\pHDYNGZFfZvXT@|ULMX\\^HAP`TRhlHE`KjmaUMYLGbFdRP@PSLDfhjjPJMtFx^NEf^EbiT{Cc\\GPA`LhfvTÖnJZCPMHSGmJiX@XSXFR]A[jGFGVLf@`J",
            ],
            ["@@LCdJ[DAPQE@S"],
            ["@@T@IXIW"],
            ["@@XNWF@S"],
          ],
          encodeOffsets: [
            [[115004, 22226]],
            [[114874, 22063]],
            [[114832, 22121]],
            [[114809, 22153]],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441800,
          name: "清远市",
          center: [113.051227, 23.685022],
          centroid: [112.879397, 24.313361],
          childrenNum: 8,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 15,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@SKcCOHcOIJYCgFs[KU@K_BOJL`ITFbUVwNGjFHGd_XU`HnG~cXEJ]^WHAROTWBgNGKWAaMCuT{FIPWA[Pe@KPD\\WZWUIgY][@YVLPgdQ^[Ik[_BWc[DMLsIAXQ\\B]ELUSoBOSWFmWkEaUYDUISNQkWIEwnsVKnIMEoLIUeUMQNaEWS_IASYWqKIUicEuaY]B]KW@WKQqYSHUIMRGLegIMYVgA[XG^WRCLcXUPBTaCmHSYOS[@aTIFQpQhBc^KHgEyQMIWWOOcSAYYYCEiWGMRYGGQWKDUf@bWRcPMFWTFdCbHJLIfRPFlJBT\\fEhyR@PKN_^KHWTGRDFTxLfhFldD\\EN`AhNXI~BH`GhN@bQHVfSZDnwIXgRCPaTEXmjFLMRK{YeAUOMHQKGLYMODYbKRFEQVJpMNeGQVKEaTW@QVuWSJKJqhKzLFWPD\\UhG^QnEdR\\SLAB]VWAQOQNKgqNOMKFg[SKQhD^Q`@IYHEMqP[rLZKau][DKVHEWKM\\[`PI[JGNNPETJXKH_M]sYCeNM^@T]dBBcM@FgLMz@Elj@^NREleN^`]GUe]IS^ytIEWPCEMXE`YRJ@PRFfHVI\\NrJ\\CPVXBPVtFh^tSfThFAPljCTSRD^XPZBBRdKIdPGz\\FMVPRjSNlAdDAVNBHRRDhLALnhALOHLUjQHaZM|CbHfVDLXCRU@UhG@KTIf`GLXRAJ`JSNFbJHKNLXSbWZfdNbXL^KdAFZhU\\TKVHRQXHNjORHNIRHR\\PLLfVPRAAjMPcNA^OPkAITSLDL[XTJhtLHTKTLVINF@TZfTAfXELRFR\\SD@VLJIPDPXJFPVBLPQLI^pZj^PIlH@POEAPqTMhBXOHYEDXSJMM_ZTTKJBrJ^SdQ@]PDPctHNAduRYNC`SHu@ECCiYCotEbaZSB[TKRWJ_CYVFZUDS]GRoDWIQaCSUSU\\QSSEUNWauOkLMZFZ@IRY]UMg@WMqOoTCTOJS`AZMOQHKO[ESgSASLWI[FOWCX]HojaMSsoCaLkfIjk^Q`QCYtODFb[RqBQH_IEJUIGl\\`CffX[¨|JRhIdLD^rGNTZQ^PRhPhdbBJJD^UXA^KFB^UZ",
            ],
          ],
          encodeOffsets: [[[115707, 25526]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 441900,
          name: "东莞市",
          center: [113.746262, 23.046237],
          centroid: [113.879966, 22.931879],
          childrenNum: 0,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 16,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@JHDpEDDjGdLLPKNHR`ALSAGN_Fa\\CtZTCdSNWAeRGMgUEJcHKPOA^~XIAL{peVUfCboNaGgYgAaRMTaXO@qKNUGe\\[S]DGRESuXo@[HoC_XkC{gcEQI@LUDOKES{@SQ]O}KMKK[WUQ[@uLyZoRo\\{VeG\\kx{~hXv@TAXULUVlzbB^VR@PRCDPXDZRBfGDNXTHLI`JJbLGHRZEKSVKLUxFbW@KdELKEOTJLEJ{PO^EdNHETN@]`@T_TT\\ERqV@HMpC@YNW`QG_OFb[`X@NPNHlERXH@^NNWhETe@LJMLRTdHPf\\J",
            ],
          ],
          encodeOffsets: [[[116971, 23361]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 442000,
          name: "中山市",
          center: [113.382391, 22.521113],
          centroid: [113.398784, 22.517323],
          childrenNum: 0,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 17,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@J@l~HpBYei^SBWTaFsGRPTcZjwlHNiPkD[J¡~KOaMYSAMwKaF[YSHMVWJMI[yc]I_BKWCaNUOAOT[M@Mg@ehoR_HkC[zuT_@@^kLeVg@wLeXO\\a@c`RkNQgLDr{^AzXHLrPOXVBXSLO`alSLZRVAVNS^GBF\\IXFVI\\RJ@Z\\LJIpPI",
            ],
          ],
          encodeOffsets: [[[116295, 22950]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 445100,
          name: "潮州市",
          center: [116.632301, 23.661701],
          centroid: [116.790217, 23.783155],
          childrenNum: 3,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 18,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@ZGVYnO IPF\\vZPtF`K\\B\\Jäh@ÊMNYC[LW\\]CQKQhwH]lMC[TEnB`GlILE^OZWRCXRPIfSbmPOMgLCN^HHXKV]LB\\ILfNN\\FfS^DbLLUVSIKHB\\_ZTPF^_AMXAtENRzXRdfR@LPXNPVOV]TIC]h[ASL_Vi[PaIK_E@YK[WGM\\WLWSIWkP[YM@SS[m@aL[IgSP[iQQmRYWRa@]WaMFL[OUERwAULKIGiQJcKCMbWCCgFHQGYBe]S_PaABQmYAI[BO_cFDUfYR[OQOHFWEMNMUQC{OWWAgH[\\YJENgE[QAMiqOFIOF_LIPDfgxGFUVUHRlQH[VF|EZkAOPQ@WMEAYP@@QRORL`UCWLQcMBMSKAoXSJYjQLBlUXD\\_EkhEJJ\\E\\VJS`RGRHTTFLXIlQrDtZTAV_XZTC\\tHRSPaLCXVZIRTETHXTGTLZAHVQJAPRVPArY@QXObNTE@OTSCiTgA}",
            ],
          ],
          encodeOffsets: [[[119724, 24097]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 445200,
          name: "揭阳市",
          center: [116.355733, 23.543778],
          centroid: [116.124317, 23.334057],
          childrenNum: 5,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 19,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@WSNFsYODBOSISckQSS_IUNJHKNkBMzYT]NSMWF@X}XadVZEpTASbXJJPOBCXPVZC^\\HpNTENVNGT^NJGDdUR@NTHhALXIVBzK\\@P[bQEKjFNZIfLHnnzp@PXLCB}VWTJZ`bRdFTOC[O[USMYHIDVCl[RWRsLQBTR^CJL`TFCdSHB\\PBDQ^URSbGFl[`WCkVKAiRIZWTBpTLANdNKRDX_VQKQP@RO@BZNF@XORBPYl{FUEG\\kRGQUVEVwHehOCKJE`[TITWNE^_D[KUUMHcKBUyHTQB[S@aea]ADUKaTKHUUGCQYY]BcP_GWPMKWHYTCNaF@MaReESRLPU\\iD[Y[QGUaQDaUCLgRYXEXuF__e{PQ@OSC\\eSkLEMUYGJ[MQUPaCOJ]CESUASHW^MbONcQS_gGD]IB]OBcO]QEPCVejWDSTStYSYCWLyb@R\\pB\\THT]pkRWMQUCI_@mx]N[iS[B{IS@QOBUNSIm[dOYFKOQxaTOdAVgPKUAUfY\\ffD`TTGP[NAEUhcC_ZA@I\\OFKWQI]YN]YfWZ`LI]kHKQEP[Ia`BHOTjJeUOXIHYhVFRZWRJzetIL[pU^BVRRUXGbNGjZZdLZKZBFYhPn`\\\\Bf[ gÌdpBZMf@VP\\vFhPTTAZNAN\\TYRK~RxCTWZ",
            ],
          ],
          encodeOffsets: [[[119350, 23661]]],
        },
      },
      {
        type: "Feature",
        properties: {
          adcode: 445300,
          name: "云浮市",
          center: [112.044439, 22.929801],
          centroid: [111.798791, 22.813664],
          childrenNum: 5,
          level: "city",
          parent: { adcode: 440000 },
          subFeatureIndex: 20,
          acroutes: [100000, 440000],
        },
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              "@@[P]EYwSU]BShBRPJWlKfAtS^DPSDeMwAYFPZZHahSADt[^CRHfJHD`WHSGOFWOQHHPDlKX\\ORJHGNP[dRLBRZtYTFHGfTfLfbBRZ@V[VANUB_NiS}Is@V]EgP_UMW@SRLQTGnWTOBKmB]LON_FoSoAFaJuZg@_NYEoHKLWj[J}AeJhKPR\\vPPVEdoxevOCHYOIGaSK[DiS_NEP_LHLi^Y@_TcK@IBUo_HIMUBMTJVMKw\\_CKXIIa@uPDNS]VEHeKY@eJU`[NCLMUNqcUESaEOO^[MUgOCIW@LcIERQDYIUQKEiOGS]UIU]aMFIeoHOeQAQ]FCM]ICYMS[U[DESsICHyEuLiAGOSGqDFWhWL]`BFT`EBKZS@WSORmNIB[dIZ]XCVLf_HQ~CHLtFrW@UpYGO{COoQKIWJ]b^TRNX_pRVKfLVGEiMWJIBcXUG_HIfDL\\t@RfM^HJOVd^jWd[jhAdbLCLVXvVVCJMCQR@EYL@KYHUL\\RO\\IpJNMD]V@nnPlC^f~vX@LbPHXdfZNOXFVVVAT\\JDPNAAQTEXcPBBu[AIOPOCWWNKMSHSUZCBUrGVSFPvQDVZXJAX\\P^d\\TMf\\I@[QU[CMa^@SXY\\CJKAYlKV[\\A\\aJ]RGnErORTh]H_NGFW\\IEXNPI\\PN`K`RbBOfNdT\\TnIhfTtJLVIfLZIFLZhEFKOSZQLJdIKXWBDLjKDOVDKLPjBbT@LPDbNADTKP`XGRNPTDLIMI^]C]IOL[^KN_XBPNnLbRKhUXBhKVUPFV_b",
            ],
          ],
          encodeOffsets: [[[115177, 23249]]],
        },
      },
    ],
    UTF8Encoding: true,
  });
});
