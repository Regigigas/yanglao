import { _ as _sfc_main$2 } from "./BasePage.vue_vue_type_script_setup_true_lang-DvK98ZDS.js";
import { l as TrianglesDrawMode, m as TriangleFanDrawMode, n as TriangleStripDrawMode, o as Loader, p as LoaderUtils, q as FileLoader, r as MeshPhysicalMaterial, s as Vector2, C as Color, t as LinearSRGBColorSpace, a as SRGBColorSpace, u as SpotLight, v as PointLight, D as DirectionalLight, w as Matrix4, I as InstancedMesh, V as Vector3, Q as Quaternion, x as InstancedBufferAttribute, y as Object3D, z as TextureLoader, A as ImageBitmapLoader, J as BufferAttribute, K as InterleavedBuffer, N as LinearMipmapLinearFilter, R as NearestMipmapLinearFilter, U as LinearMipmapNearestFilter, X as NearestMipmapNearestFilter, Y as LinearFilter, Z as NearestFilter, _ as RepeatWrapping, $ as MirroredRepeatWrapping, a0 as ClampToEdgeWrapping, a1 as PointsMaterial, a2 as Material, f as LineBasicMaterial, d as MeshStandardMaterial, a3 as DoubleSide, a4 as MeshBasicMaterial, a5 as PropertyBinding, a6 as BufferGeometry, a7 as SkinnedMesh, M as Mesh, L as LineSegments, a8 as Line, a9 as LineLoop, aa as Points, e as Group, P as PerspectiveCamera, ab as MathUtils, ac as OrthographicCamera, ad as Skeleton, ae as AnimationClip, af as Bone, ag as InterpolateDiscrete, ah as InterpolateLinear, ai as InterleavedBufferAttribute, aj as Texture, ak as VectorKeyframeTrack, al as NumberKeyframeTrack, am as QuaternionKeyframeTrack, an as ColorManagement, ao as FrontSide, ap as Interpolant, g as Box3, aq as Sphere, S as Scene, ar as FogExp2, W as WebGLRenderer, O as OrbitControls, H as HemisphereLight, c as CircleGeometry, G as GridHelper, as as Raycaster, at as CylinderGeometry, au as TubeGeometry, av as SphereGeometry, aw as CapsuleGeometry, ax as CatmullRomCurve3, ay as CurvePath, az as LineCurve3, aA as Float32BufferAttribute, aB as TorusGeometry } from "./OrbitControls-D8FOeTdb.js";
import { l as defineComponent, w as watch, o as onMounted, b as onBeforeUnmount, W as openBlock, a2 as createElementBlock, a4 as createBaseVNode, a8 as createCommentVNode, r as ref, V as createBlock, X as withCtx, Y as createVNode, u as unref, k as createTextVNode, a7 as renderList, F as Fragment, aa as toDisplayString, c as computed, J as normalizeClass } from "./vendor-vue-2vV4mHq_.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { M as NGridItem, g as NCard, v as NSpace, m as NCheckbox, X as NDivider, $ as NSlider, B as Button, S as NTabs, T as NTabPane, E as NList, o as NTag, i as NAlert, P as NGrid, V as NButtonGroup, K as NListItem } from "./vendor-naive-BtQtGa5j.js";
import "./index-CFdyZwJX.js";
import "./vendor-query-PNa2cx3k.js";
import "./vendor-echarts-BB4Q9O_5.js";
function toTrianglesDrawMode(geometry, drawMode) {
  if (drawMode === TrianglesDrawMode) {
    console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.");
    return geometry;
  }
  if (drawMode === TriangleFanDrawMode || drawMode === TriangleStripDrawMode) {
    let index = geometry.getIndex();
    if (index === null) {
      const indices = [];
      const position = geometry.getAttribute("position");
      if (position !== void 0) {
        for (let i = 0; i < position.count; i++) {
          indices.push(i);
        }
        geometry.setIndex(indices);
        index = geometry.getIndex();
      } else {
        console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.");
        return geometry;
      }
    }
    const numberOfTriangles = index.count - 2;
    const newIndices = [];
    if (drawMode === TriangleFanDrawMode) {
      for (let i = 1; i <= numberOfTriangles; i++) {
        newIndices.push(index.getX(0));
        newIndices.push(index.getX(i));
        newIndices.push(index.getX(i + 1));
      }
    } else {
      for (let i = 0; i < numberOfTriangles; i++) {
        if (i % 2 === 0) {
          newIndices.push(index.getX(i));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i + 2));
        } else {
          newIndices.push(index.getX(i + 2));
          newIndices.push(index.getX(i + 1));
          newIndices.push(index.getX(i));
        }
      }
    }
    if (newIndices.length / 3 !== numberOfTriangles) {
      console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    }
    const newGeometry = geometry.clone();
    newGeometry.setIndex(newIndices);
    newGeometry.clearGroups();
    return newGeometry;
  } else {
    console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", drawMode);
    return geometry;
  }
}
function clone(source) {
  const sourceLookup = /* @__PURE__ */ new Map();
  const cloneLookup = /* @__PURE__ */ new Map();
  const clone2 = source.clone();
  parallelTraverse(source, clone2, function(sourceNode, clonedNode) {
    sourceLookup.set(clonedNode, sourceNode);
    cloneLookup.set(sourceNode, clonedNode);
  });
  clone2.traverse(function(node) {
    if (!node.isSkinnedMesh) return;
    const clonedMesh = node;
    const sourceMesh = sourceLookup.get(node);
    const sourceBones = sourceMesh.skeleton.bones;
    clonedMesh.skeleton = sourceMesh.skeleton.clone();
    clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);
    clonedMesh.skeleton.bones = sourceBones.map(function(bone) {
      return cloneLookup.get(bone);
    });
    clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
  });
  return clone2;
}
function parallelTraverse(a, b, callback) {
  callback(a, b);
  for (let i = 0; i < a.children.length; i++) {
    parallelTraverse(a.children[i], b.children[i], callback);
  }
}
class GLTFLoader extends Loader {
  /**
   * Constructs a new glTF loader.
   *
   * @param {LoadingManager} [manager] - The loading manager.
   */
  constructor(manager) {
    super(manager);
    this.dracoLoader = null;
    this.ktx2Loader = null;
    this.meshoptDecoder = null;
    this.pluginCallbacks = [];
    this.register(function(parser) {
      return new GLTFMaterialsClearcoatExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsDispersionExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFTextureBasisUExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFTextureWebPExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFTextureAVIFExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsSheenExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsTransmissionExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsVolumeExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsIorExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsEmissiveStrengthExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsSpecularExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsIridescenceExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsAnisotropyExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMaterialsBumpExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFLightsExtension(parser);
    });
    this.register(function(parser) {
      return new GLTFMeshoptCompression(parser, EXTENSIONS.EXT_MESHOPT_COMPRESSION);
    });
    this.register(function(parser) {
      return new GLTFMeshoptCompression(parser, EXTENSIONS.KHR_MESHOPT_COMPRESSION);
    });
    this.register(function(parser) {
      return new GLTFMeshGpuInstancing(parser);
    });
  }
  /**
   * Starts loading from the given URL and passes the loaded glTF asset
   * to the `onLoad()` callback.
   *
   * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onProgressCallback} onProgress - Executed while the loading is in progress.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  load(url, onLoad, onProgress, onError) {
    const scope = this;
    let resourcePath;
    if (this.resourcePath !== "") {
      resourcePath = this.resourcePath;
    } else if (this.path !== "") {
      const relativeUrl = LoaderUtils.extractUrlBase(url);
      resourcePath = LoaderUtils.resolveURL(relativeUrl, this.path);
    } else {
      resourcePath = LoaderUtils.extractUrlBase(url);
    }
    this.manager.itemStart(url);
    const _onError = function(e) {
      if (onError) {
        onError(e);
      } else {
        console.error(e);
      }
      scope.manager.itemError(url);
      scope.manager.itemEnd(url);
    };
    const loader = new FileLoader(this.manager);
    loader.setPath(this.path);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    loader.load(url, function(data) {
      try {
        scope.parse(data, resourcePath, function(gltf) {
          onLoad(gltf);
          scope.manager.itemEnd(url);
        }, _onError);
      } catch (e) {
        _onError(e);
      }
    }, onProgress, _onError);
  }
  /**
   * Sets the given Draco loader to this loader. Required for decoding assets
   * compressed with the `KHR_draco_mesh_compression` extension.
   *
   * @param {DRACOLoader} dracoLoader - The Draco loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setDRACOLoader(dracoLoader) {
    this.dracoLoader = dracoLoader;
    return this;
  }
  /**
   * Sets the given KTX2 loader to this loader. Required for loading KTX2
   * compressed textures.
   *
   * @param {KTX2Loader} ktx2Loader - The KTX2 loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setKTX2Loader(ktx2Loader) {
    this.ktx2Loader = ktx2Loader;
    return this;
  }
  /**
   * Sets the given meshopt decoder. Required for decoding assets
   * compressed with the `EXT_meshopt_compression` extension.
   *
   * @param {Object} meshoptDecoder - The meshopt decoder to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setMeshoptDecoder(meshoptDecoder) {
    this.meshoptDecoder = meshoptDecoder;
    return this;
  }
  /**
   * Registers a plugin callback. This API is internally used to implement the various
   * glTF extensions but can also used by third-party code to add additional logic
   * to the loader.
   *
   * @param {function(parser:GLTFParser)} callback - The callback function to register.
   * @return {GLTFLoader} A reference to this loader.
   */
  register(callback) {
    if (this.pluginCallbacks.indexOf(callback) === -1) {
      this.pluginCallbacks.push(callback);
    }
    return this;
  }
  /**
   * Unregisters a plugin callback.
   *
   * @param {Function} callback - The callback function to unregister.
   * @return {GLTFLoader} A reference to this loader.
   */
  unregister(callback) {
    if (this.pluginCallbacks.indexOf(callback) !== -1) {
      this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
    }
    return this;
  }
  /**
   * Parses the given glTF data and returns the resulting group.
   *
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  parse(data, path, onLoad, onError) {
    let json;
    const extensions = {};
    const plugins = {};
    const textDecoder = new TextDecoder();
    if (typeof data === "string") {
      json = JSON.parse(data);
    } else if (data instanceof ArrayBuffer) {
      const magic = textDecoder.decode(new Uint8Array(data, 0, 4));
      if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
        try {
          extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
        } catch (error) {
          if (onError) onError(error);
          return;
        }
        json = JSON.parse(extensions[EXTENSIONS.KHR_BINARY_GLTF].content);
      } else {
        json = JSON.parse(textDecoder.decode(data));
      }
    } else {
      json = data;
    }
    if (json.asset === void 0 || json.asset.version[0] < 2) {
      if (onError) onError(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const parser = new GLTFParser(json, {
      path: path || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    parser.fileLoader.setRequestHeader(this.requestHeader);
    for (let i = 0; i < this.pluginCallbacks.length; i++) {
      const plugin = this.pluginCallbacks[i](parser);
      if (!plugin.name) console.error("THREE.GLTFLoader: Invalid plugin found: missing name");
      plugins[plugin.name] = plugin;
      extensions[plugin.name] = true;
    }
    if (json.extensionsUsed) {
      for (let i = 0; i < json.extensionsUsed.length; ++i) {
        const extensionName = json.extensionsUsed[i];
        const extensionsRequired = json.extensionsRequired || [];
        switch (extensionName) {
          case EXTENSIONS.KHR_MATERIALS_UNLIT:
            extensions[extensionName] = new GLTFMaterialsUnlitExtension();
            break;
          case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
            extensions[extensionName] = new GLTFDracoMeshCompressionExtension(json, this.dracoLoader);
            break;
          case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
            extensions[extensionName] = new GLTFTextureTransformExtension();
            break;
          case EXTENSIONS.KHR_MESH_QUANTIZATION:
            extensions[extensionName] = new GLTFMeshQuantizationExtension();
            break;
          default:
            if (extensionsRequired.indexOf(extensionName) >= 0 && plugins[extensionName] === void 0) {
              console.warn('THREE.GLTFLoader: Unknown extension "' + extensionName + '".');
            }
        }
      }
    }
    parser.setExtensions(extensions);
    parser.setPlugins(plugins);
    parser.parse(onLoad, onError);
  }
  /**
   * Async version of {@link GLTFLoader#parse}.
   *
   * @async
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @return {Promise<GLTFLoader~LoadObject>} A Promise that resolves with the loaded glTF when the parsing has been finished.
   */
  parseAsync(data, path) {
    const scope = this;
    return new Promise(function(resolve, reject) {
      scope.parse(data, path, resolve, reject);
    });
  }
}
function GLTFRegistry() {
  let objects = {};
  return {
    get: function(key) {
      return objects[key];
    },
    add: function(key, object) {
      objects[key] = object;
    },
    remove: function(key) {
      delete objects[key];
    },
    removeAll: function() {
      objects = {};
    }
  };
}
function getMaterialExtension(parser, materialIndex, extensionName) {
  const materialDef = parser.json.materials[materialIndex];
  if (materialDef.extensions && materialDef.extensions[extensionName]) {
    return materialDef.extensions[extensionName];
  }
  return null;
}
const EXTENSIONS = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class GLTFLightsExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;
    this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const parser = this.parser;
    const nodeDefs = this.parser.json.nodes || [];
    for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
      const nodeDef = nodeDefs[nodeIndex];
      if (nodeDef.extensions && nodeDef.extensions[this.name] && nodeDef.extensions[this.name].light !== void 0) {
        parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);
      }
    }
  }
  _loadLight(lightIndex) {
    const parser = this.parser;
    const cacheKey = "light:" + lightIndex;
    let dependency = parser.cache.get(cacheKey);
    if (dependency) return dependency;
    const json = parser.json;
    const extensions = json.extensions && json.extensions[this.name] || {};
    const lightDefs = extensions.lights || [];
    const lightDef = lightDefs[lightIndex];
    let lightNode;
    const color = new Color(16777215);
    if (lightDef.color !== void 0) color.setRGB(lightDef.color[0], lightDef.color[1], lightDef.color[2], LinearSRGBColorSpace);
    const range = lightDef.range !== void 0 ? lightDef.range : 0;
    switch (lightDef.type) {
      case "directional":
        lightNode = new DirectionalLight(color);
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break;
      case "point":
        lightNode = new PointLight(color);
        lightNode.distance = range;
        break;
      case "spot":
        lightNode = new SpotLight(color);
        lightNode.distance = range;
        lightDef.spot = lightDef.spot || {};
        lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== void 0 ? lightDef.spot.innerConeAngle : 0;
        lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== void 0 ? lightDef.spot.outerConeAngle : Math.PI / 4;
        lightNode.angle = lightDef.spot.outerConeAngle;
        lightNode.penumbra = 1 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
        lightNode.target.position.set(0, 0, -1);
        lightNode.add(lightNode.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + lightDef.type);
    }
    lightNode.position.set(0, 0, 0);
    assignExtrasToUserData(lightNode, lightDef);
    if (lightDef.intensity !== void 0) lightNode.intensity = lightDef.intensity;
    lightNode.name = parser.createUniqueName(lightDef.name || "light_" + lightIndex);
    dependency = Promise.resolve(lightNode);
    parser.cache.add(cacheKey, dependency);
    return dependency;
  }
  getDependency(type, index) {
    if (type !== "light") return;
    return this._loadLight(index);
  }
  createNodeAttachment(nodeIndex) {
    const self2 = this;
    const parser = this.parser;
    const json = parser.json;
    const nodeDef = json.nodes[nodeIndex];
    const lightDef = nodeDef.extensions && nodeDef.extensions[this.name] || {};
    const lightIndex = lightDef.light;
    if (lightIndex === void 0) return null;
    return this._loadLight(lightIndex).then(function(light) {
      return parser._getNodeRef(self2.cache, lightIndex, light);
    });
  }
}
class GLTFMaterialsUnlitExtension {
  constructor() {
    this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return MeshBasicMaterial;
  }
  extendParams(materialParams, materialDef, parser) {
    const pending = [];
    materialParams.color = new Color(1, 1, 1);
    materialParams.opacity = 1;
    const metallicRoughness = materialDef.pbrMetallicRoughness;
    if (metallicRoughness) {
      if (Array.isArray(metallicRoughness.baseColorFactor)) {
        const array = metallicRoughness.baseColorFactor;
        materialParams.color.setRGB(array[0], array[1], array[2], LinearSRGBColorSpace);
        materialParams.opacity = array[3];
      }
      if (metallicRoughness.baseColorTexture !== void 0) {
        pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture, SRGBColorSpace));
      }
    }
    return Promise.all(pending);
  }
}
class GLTFMaterialsEmissiveStrengthExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    if (extension.emissiveStrength !== void 0) {
      materialParams.emissiveIntensity = extension.emissiveStrength;
    }
    return Promise.resolve();
  }
}
class GLTFMaterialsClearcoatExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    if (extension.clearcoatFactor !== void 0) {
      materialParams.clearcoat = extension.clearcoatFactor;
    }
    if (extension.clearcoatTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "clearcoatMap", extension.clearcoatTexture));
    }
    if (extension.clearcoatRoughnessFactor !== void 0) {
      materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;
    }
    if (extension.clearcoatRoughnessTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "clearcoatRoughnessMap", extension.clearcoatRoughnessTexture));
    }
    if (extension.clearcoatNormalTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "clearcoatNormalMap", extension.clearcoatNormalTexture));
      if (extension.clearcoatNormalTexture.scale !== void 0) {
        const scale = extension.clearcoatNormalTexture.scale;
        materialParams.clearcoatNormalScale = new Vector2(scale, scale);
      }
    }
    return Promise.all(pending);
  }
}
class GLTFMaterialsDispersionExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    materialParams.dispersion = extension.dispersion !== void 0 ? extension.dispersion : 0;
    return Promise.resolve();
  }
}
class GLTFMaterialsIridescenceExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    if (extension.iridescenceFactor !== void 0) {
      materialParams.iridescence = extension.iridescenceFactor;
    }
    if (extension.iridescenceTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "iridescenceMap", extension.iridescenceTexture));
    }
    if (extension.iridescenceIor !== void 0) {
      materialParams.iridescenceIOR = extension.iridescenceIor;
    }
    if (materialParams.iridescenceThicknessRange === void 0) {
      materialParams.iridescenceThicknessRange = [100, 400];
    }
    if (extension.iridescenceThicknessMinimum !== void 0) {
      materialParams.iridescenceThicknessRange[0] = extension.iridescenceThicknessMinimum;
    }
    if (extension.iridescenceThicknessMaximum !== void 0) {
      materialParams.iridescenceThicknessRange[1] = extension.iridescenceThicknessMaximum;
    }
    if (extension.iridescenceThicknessTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "iridescenceThicknessMap", extension.iridescenceThicknessTexture));
    }
    return Promise.all(pending);
  }
}
class GLTFMaterialsSheenExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    materialParams.sheenColor = new Color(0, 0, 0);
    materialParams.sheenRoughness = 0;
    materialParams.sheen = 1;
    if (extension.sheenColorFactor !== void 0) {
      const colorFactor = extension.sheenColorFactor;
      materialParams.sheenColor.setRGB(colorFactor[0], colorFactor[1], colorFactor[2], LinearSRGBColorSpace);
    }
    if (extension.sheenRoughnessFactor !== void 0) {
      materialParams.sheenRoughness = extension.sheenRoughnessFactor;
    }
    if (extension.sheenColorTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "sheenColorMap", extension.sheenColorTexture, SRGBColorSpace));
    }
    if (extension.sheenRoughnessTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "sheenRoughnessMap", extension.sheenRoughnessTexture));
    }
    return Promise.all(pending);
  }
}
class GLTFMaterialsTransmissionExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    if (extension.transmissionFactor !== void 0) {
      materialParams.transmission = extension.transmissionFactor;
    }
    if (extension.transmissionTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "transmissionMap", extension.transmissionTexture));
    }
    return Promise.all(pending);
  }
}
class GLTFMaterialsVolumeExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    materialParams.thickness = extension.thicknessFactor !== void 0 ? extension.thicknessFactor : 0;
    if (extension.thicknessTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "thicknessMap", extension.thicknessTexture));
    }
    materialParams.attenuationDistance = extension.attenuationDistance || Infinity;
    const colorArray = extension.attenuationColor || [1, 1, 1];
    materialParams.attenuationColor = new Color().setRGB(colorArray[0], colorArray[1], colorArray[2], LinearSRGBColorSpace);
    return Promise.all(pending);
  }
}
class GLTFMaterialsIorExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_IOR;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    materialParams.ior = extension.ior !== void 0 ? extension.ior : 1.5;
    if (materialParams.ior === 0) materialParams.ior = 1e3;
    return Promise.resolve();
  }
}
class GLTFMaterialsSpecularExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    materialParams.specularIntensity = extension.specularFactor !== void 0 ? extension.specularFactor : 1;
    if (extension.specularTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "specularIntensityMap", extension.specularTexture));
    }
    const colorArray = extension.specularColorFactor || [1, 1, 1];
    materialParams.specularColor = new Color().setRGB(colorArray[0], colorArray[1], colorArray[2], LinearSRGBColorSpace);
    if (extension.specularColorTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "specularColorMap", extension.specularColorTexture, SRGBColorSpace));
    }
    return Promise.all(pending);
  }
}
class GLTFMaterialsBumpExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.EXT_MATERIALS_BUMP;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    materialParams.bumpScale = extension.bumpFactor !== void 0 ? extension.bumpFactor : 1;
    if (extension.bumpTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "bumpMap", extension.bumpTexture));
    }
    return Promise.all(pending);
  }
}
class GLTFMaterialsAnisotropyExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(materialIndex) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    return extension !== null ? MeshPhysicalMaterial : null;
  }
  extendMaterialParams(materialIndex, materialParams) {
    const extension = getMaterialExtension(this.parser, materialIndex, this.name);
    if (extension === null) return Promise.resolve();
    const pending = [];
    if (extension.anisotropyStrength !== void 0) {
      materialParams.anisotropy = extension.anisotropyStrength;
    }
    if (extension.anisotropyRotation !== void 0) {
      materialParams.anisotropyRotation = extension.anisotropyRotation;
    }
    if (extension.anisotropyTexture !== void 0) {
      pending.push(this.parser.assignTexture(materialParams, "anisotropyMap", extension.anisotropyTexture));
    }
    return Promise.all(pending);
  }
}
class GLTFTextureBasisUExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.KHR_TEXTURE_BASISU;
  }
  loadTexture(textureIndex) {
    const parser = this.parser;
    const json = parser.json;
    const textureDef = json.textures[textureIndex];
    if (!textureDef.extensions || !textureDef.extensions[this.name]) {
      return null;
    }
    const extension = textureDef.extensions[this.name];
    const loader = parser.options.ktx2Loader;
    if (!loader) {
      if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      } else {
        return null;
      }
    }
    return parser.loadTextureImage(textureIndex, extension.source, loader);
  }
}
class GLTFTextureWebPExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
  }
  loadTexture(textureIndex) {
    const name = this.name;
    const parser = this.parser;
    const json = parser.json;
    const textureDef = json.textures[textureIndex];
    if (!textureDef.extensions || !textureDef.extensions[name]) {
      return null;
    }
    const extension = textureDef.extensions[name];
    const source = json.images[extension.source];
    let loader = parser.textureLoader;
    if (source.uri) {
      const handler = parser.options.manager.getHandler(source.uri);
      if (handler !== null) loader = handler;
    }
    return parser.loadTextureImage(textureIndex, extension.source, loader);
  }
}
class GLTFTextureAVIFExtension {
  constructor(parser) {
    this.parser = parser;
    this.name = EXTENSIONS.EXT_TEXTURE_AVIF;
  }
  loadTexture(textureIndex) {
    const name = this.name;
    const parser = this.parser;
    const json = parser.json;
    const textureDef = json.textures[textureIndex];
    if (!textureDef.extensions || !textureDef.extensions[name]) {
      return null;
    }
    const extension = textureDef.extensions[name];
    const source = json.images[extension.source];
    let loader = parser.textureLoader;
    if (source.uri) {
      const handler = parser.options.manager.getHandler(source.uri);
      if (handler !== null) loader = handler;
    }
    return parser.loadTextureImage(textureIndex, extension.source, loader);
  }
}
class GLTFMeshoptCompression {
  constructor(parser, name) {
    this.name = name;
    this.parser = parser;
  }
  loadBufferView(index) {
    const json = this.parser.json;
    const bufferView = json.bufferViews[index];
    if (bufferView.extensions && bufferView.extensions[this.name]) {
      const extensionDef = bufferView.extensions[this.name];
      const buffer = this.parser.getDependency("buffer", extensionDef.buffer);
      const decoder = this.parser.options.meshoptDecoder;
      if (!decoder || !decoder.supported) {
        if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        } else {
          return null;
        }
      }
      return buffer.then(function(res) {
        const byteOffset = extensionDef.byteOffset || 0;
        const byteLength = extensionDef.byteLength || 0;
        const count = extensionDef.count;
        const stride = extensionDef.byteStride;
        const source = new Uint8Array(res, byteOffset, byteLength);
        if (decoder.decodeGltfBufferAsync) {
          return decoder.decodeGltfBufferAsync(count, stride, source, extensionDef.mode, extensionDef.filter).then(function(res2) {
            return res2.buffer;
          });
        } else {
          return decoder.ready.then(function() {
            const result = new ArrayBuffer(count * stride);
            decoder.decodeGltfBuffer(new Uint8Array(result), count, stride, source, extensionDef.mode, extensionDef.filter);
            return result;
          });
        }
      });
    } else {
      return null;
    }
  }
}
class GLTFMeshGpuInstancing {
  constructor(parser) {
    this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
    this.parser = parser;
  }
  createNodeMesh(nodeIndex) {
    const json = this.parser.json;
    const nodeDef = json.nodes[nodeIndex];
    if (!nodeDef.extensions || !nodeDef.extensions[this.name] || nodeDef.mesh === void 0) {
      return null;
    }
    const meshDef = json.meshes[nodeDef.mesh];
    for (const primitive of meshDef.primitives) {
      if (primitive.mode !== WEBGL_CONSTANTS.TRIANGLES && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP && primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN && primitive.mode !== void 0) {
        return null;
      }
    }
    const extensionDef = nodeDef.extensions[this.name];
    const attributesDef = extensionDef.attributes;
    const pending = [];
    const attributes = {};
    for (const key in attributesDef) {
      pending.push(this.parser.getDependency("accessor", attributesDef[key]).then((accessor) => {
        attributes[key] = accessor;
        return attributes[key];
      }));
    }
    if (pending.length < 1) {
      return null;
    }
    pending.push(this.parser.createNodeMesh(nodeIndex));
    return Promise.all(pending).then((results) => {
      const nodeObject = results.pop();
      const meshes = nodeObject.isGroup ? nodeObject.children : [nodeObject];
      const count = results[0].count;
      const instancedMeshes = [];
      for (const mesh of meshes) {
        const m = new Matrix4();
        const p = new Vector3();
        const q = new Quaternion();
        const s = new Vector3(1, 1, 1);
        const instancedMesh = new InstancedMesh(mesh.geometry, mesh.material, count);
        for (let i = 0; i < count; i++) {
          if (attributes.TRANSLATION) {
            p.fromBufferAttribute(attributes.TRANSLATION, i);
          }
          if (attributes.ROTATION) {
            q.fromBufferAttribute(attributes.ROTATION, i);
          }
          if (attributes.SCALE) {
            s.fromBufferAttribute(attributes.SCALE, i);
          }
          instancedMesh.setMatrixAt(i, m.compose(p, q, s));
        }
        for (const attributeName in attributes) {
          if (attributeName === "_COLOR_0") {
            const attr = attributes[attributeName];
            instancedMesh.instanceColor = new InstancedBufferAttribute(attr.array, attr.itemSize, attr.normalized);
          } else if (attributeName !== "TRANSLATION" && attributeName !== "ROTATION" && attributeName !== "SCALE") {
            mesh.geometry.setAttribute(attributeName, attributes[attributeName]);
          }
        }
        Object3D.prototype.copy.call(instancedMesh, mesh);
        this.parser.assignFinalMaterial(instancedMesh);
        instancedMeshes.push(instancedMesh);
      }
      if (nodeObject.isGroup) {
        nodeObject.clear();
        nodeObject.add(...instancedMeshes);
        return nodeObject;
      }
      return instancedMeshes[0];
    });
  }
}
const BINARY_EXTENSION_HEADER_MAGIC = "glTF";
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 1313821514, BIN: 5130562 };
class GLTFBinaryExtension {
  constructor(data) {
    this.name = EXTENSIONS.KHR_BINARY_GLTF;
    this.content = null;
    this.body = null;
    const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
    const textDecoder = new TextDecoder();
    this.header = {
      magic: textDecoder.decode(new Uint8Array(data.slice(0, 4))),
      version: headerView.getUint32(4, true),
      length: headerView.getUint32(8, true)
    };
    if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    } else if (this.header.version < 2) {
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    }
    const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
    const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
    let chunkIndex = 0;
    while (chunkIndex < chunkContentsLength) {
      const chunkLength = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;
      const chunkType = chunkView.getUint32(chunkIndex, true);
      chunkIndex += 4;
      if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
        const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
        this.content = textDecoder.decode(contentArray);
      } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
        const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
        this.body = data.slice(byteOffset, byteOffset + chunkLength);
      }
      chunkIndex += chunkLength;
    }
    if (this.content === null) {
      throw new Error("THREE.GLTFLoader: JSON content not found.");
    }
  }
}
class GLTFDracoMeshCompressionExtension {
  constructor(json, dracoLoader) {
    if (!dracoLoader) {
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    }
    this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
    this.json = json;
    this.dracoLoader = dracoLoader;
    this.dracoLoader.preload();
  }
  decodePrimitive(primitive, parser) {
    const json = this.json;
    const dracoLoader = this.dracoLoader;
    const bufferViewIndex = primitive.extensions[this.name].bufferView;
    const gltfAttributeMap = primitive.extensions[this.name].attributes;
    const threeAttributeMap = {};
    const attributeNormalizedMap = {};
    const attributeTypeMap = {};
    for (const attributeName in gltfAttributeMap) {
      const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
      threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName];
    }
    for (const attributeName in primitive.attributes) {
      const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
      if (gltfAttributeMap[attributeName] !== void 0) {
        const accessorDef = json.accessors[primitive.attributes[attributeName]];
        const componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
        attributeTypeMap[threeAttributeName] = componentType.name;
        attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true;
      }
    }
    return parser.getDependency("bufferView", bufferViewIndex).then(function(bufferView) {
      return new Promise(function(resolve, reject) {
        dracoLoader.decodeDracoFile(bufferView, function(geometry) {
          for (const attributeName in geometry.attributes) {
            const attribute = geometry.attributes[attributeName];
            const normalized = attributeNormalizedMap[attributeName];
            if (normalized !== void 0) attribute.normalized = normalized;
          }
          resolve(geometry);
        }, threeAttributeMap, attributeTypeMap, LinearSRGBColorSpace, reject);
      });
    });
  }
}
class GLTFTextureTransformExtension {
  constructor() {
    this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(texture, transform) {
    if ((transform.texCoord === void 0 || transform.texCoord === texture.channel) && transform.offset === void 0 && transform.rotation === void 0 && transform.scale === void 0) {
      return texture;
    }
    texture = texture.clone();
    if (transform.texCoord !== void 0) {
      texture.channel = transform.texCoord;
    }
    if (transform.offset !== void 0) {
      texture.offset.fromArray(transform.offset);
    }
    if (transform.rotation !== void 0) {
      texture.rotation = transform.rotation;
    }
    if (transform.scale !== void 0) {
      texture.repeat.fromArray(transform.scale);
    }
    texture.needsUpdate = true;
    return texture;
  }
}
class GLTFMeshQuantizationExtension {
  constructor() {
    this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;
  }
}
class GLTFCubicSplineInterpolant extends Interpolant {
  constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {
    super(parameterPositions, sampleValues, sampleSize, resultBuffer);
  }
  copySampleValue_(index) {
    const result = this.resultBuffer, values = this.sampleValues, valueSize = this.valueSize, offset = index * valueSize * 3 + valueSize;
    for (let i = 0; i !== valueSize; i++) {
      result[i] = values[offset + i];
    }
    return result;
  }
  interpolate_(i1, t0, t, t1) {
    const result = this.resultBuffer;
    const values = this.sampleValues;
    const stride = this.valueSize;
    const stride2 = stride * 2;
    const stride3 = stride * 3;
    const td = t1 - t0;
    const p = (t - t0) / td;
    const pp = p * p;
    const ppp = pp * p;
    const offset1 = i1 * stride3;
    const offset0 = offset1 - stride3;
    const s2 = -2 * ppp + 3 * pp;
    const s3 = ppp - pp;
    const s0 = 1 - s2;
    const s1 = s3 - pp + p;
    for (let i = 0; i !== stride; i++) {
      const p0 = values[offset0 + i + stride];
      const m0 = values[offset0 + i + stride2] * td;
      const p1 = values[offset1 + i + stride];
      const m1 = values[offset1 + i] * td;
      result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
    }
    return result;
  }
}
const _quaternion = new Quaternion();
class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {
  interpolate_(i1, t0, t, t1) {
    const result = super.interpolate_(i1, t0, t, t1);
    _quaternion.fromArray(result).normalize().toArray(result);
    return result;
  }
}
const WEBGL_CONSTANTS = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
};
const WEBGL_COMPONENT_TYPES = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
};
const WEBGL_FILTERS = {
  9728: NearestFilter,
  9729: LinearFilter,
  9984: NearestMipmapNearestFilter,
  9985: LinearMipmapNearestFilter,
  9986: NearestMipmapLinearFilter,
  9987: LinearMipmapLinearFilter
};
const WEBGL_WRAPPINGS = {
  33071: ClampToEdgeWrapping,
  33648: MirroredRepeatWrapping,
  10497: RepeatWrapping
};
const WEBGL_TYPE_SIZES = {
  "SCALAR": 1,
  "VEC2": 2,
  "VEC3": 3,
  "VEC4": 4,
  "MAT2": 4,
  "MAT3": 9,
  "MAT4": 16
};
const ATTRIBUTES = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
};
const PATH_PROPERTIES = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
};
const INTERPOLATION = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: InterpolateLinear,
  STEP: InterpolateDiscrete
};
const ALPHA_MODES = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function createDefaultMaterial(cache) {
  if (cache["DefaultMaterial"] === void 0) {
    cache["DefaultMaterial"] = new MeshStandardMaterial({
      color: 16777215,
      emissive: 0,
      metalness: 1,
      roughness: 1,
      transparent: false,
      depthTest: true,
      side: FrontSide
    });
  }
  return cache["DefaultMaterial"];
}
function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
  for (const name in objectDef.extensions) {
    if (knownExtensions[name] === void 0) {
      object.userData.gltfExtensions = object.userData.gltfExtensions || {};
      object.userData.gltfExtensions[name] = objectDef.extensions[name];
    }
  }
}
function assignExtrasToUserData(object, gltfDef) {
  if (gltfDef.extras !== void 0) {
    if (typeof gltfDef.extras === "object") {
      Object.assign(object.userData, gltfDef.extras);
    } else {
      console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + gltfDef.extras);
    }
  }
}
function addMorphTargets(geometry, targets, parser) {
  let hasMorphPosition = false;
  let hasMorphNormal = false;
  let hasMorphColor = false;
  for (let i = 0, il = targets.length; i < il; i++) {
    const target = targets[i];
    if (target.POSITION !== void 0) hasMorphPosition = true;
    if (target.NORMAL !== void 0) hasMorphNormal = true;
    if (target.COLOR_0 !== void 0) hasMorphColor = true;
    if (hasMorphPosition && hasMorphNormal && hasMorphColor) break;
  }
  if (!hasMorphPosition && !hasMorphNormal && !hasMorphColor) return Promise.resolve(geometry);
  const pendingPositionAccessors = [];
  const pendingNormalAccessors = [];
  const pendingColorAccessors = [];
  for (let i = 0, il = targets.length; i < il; i++) {
    const target = targets[i];
    if (hasMorphPosition) {
      const pendingAccessor = target.POSITION !== void 0 ? parser.getDependency("accessor", target.POSITION) : geometry.attributes.position;
      pendingPositionAccessors.push(pendingAccessor);
    }
    if (hasMorphNormal) {
      const pendingAccessor = target.NORMAL !== void 0 ? parser.getDependency("accessor", target.NORMAL) : geometry.attributes.normal;
      pendingNormalAccessors.push(pendingAccessor);
    }
    if (hasMorphColor) {
      const pendingAccessor = target.COLOR_0 !== void 0 ? parser.getDependency("accessor", target.COLOR_0) : geometry.attributes.color;
      pendingColorAccessors.push(pendingAccessor);
    }
  }
  return Promise.all([
    Promise.all(pendingPositionAccessors),
    Promise.all(pendingNormalAccessors),
    Promise.all(pendingColorAccessors)
  ]).then(function(accessors) {
    const morphPositions = accessors[0];
    const morphNormals = accessors[1];
    const morphColors = accessors[2];
    if (hasMorphPosition) geometry.morphAttributes.position = morphPositions;
    if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals;
    if (hasMorphColor) geometry.morphAttributes.color = morphColors;
    geometry.morphTargetsRelative = true;
    return geometry;
  });
}
function updateMorphTargets(mesh, meshDef) {
  mesh.updateMorphTargets();
  if (meshDef.weights !== void 0) {
    for (let i = 0, il = meshDef.weights.length; i < il; i++) {
      mesh.morphTargetInfluences[i] = meshDef.weights[i];
    }
  }
  if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
    const targetNames = meshDef.extras.targetNames;
    if (mesh.morphTargetInfluences.length === targetNames.length) {
      mesh.morphTargetDictionary = {};
      for (let i = 0, il = targetNames.length; i < il; i++) {
        mesh.morphTargetDictionary[targetNames[i]] = i;
      }
    } else {
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
    }
  }
}
function createPrimitiveKey(primitiveDef) {
  let geometryKey;
  const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
  if (dracoExtension) {
    geometryKey = "draco:" + dracoExtension.bufferView + ":" + dracoExtension.indices + ":" + createAttributesKey(dracoExtension.attributes);
  } else {
    geometryKey = primitiveDef.indices + ":" + createAttributesKey(primitiveDef.attributes) + ":" + primitiveDef.mode;
  }
  if (primitiveDef.targets !== void 0) {
    for (let i = 0, il = primitiveDef.targets.length; i < il; i++) {
      geometryKey += ":" + createAttributesKey(primitiveDef.targets[i]);
    }
  }
  return geometryKey;
}
function createAttributesKey(attributes) {
  let attributesKey = "";
  const keys = Object.keys(attributes).sort();
  for (let i = 0, il = keys.length; i < il; i++) {
    attributesKey += keys[i] + ":" + attributes[keys[i]] + ";";
  }
  return attributesKey;
}
function getNormalizedComponentScale(constructor) {
  switch (constructor) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function getImageURIMimeType(uri) {
  if (uri.search(/\.jpe?g($|\?)/i) > 0 || uri.search(/^data\:image\/jpeg/) === 0) return "image/jpeg";
  if (uri.search(/\.webp($|\?)/i) > 0 || uri.search(/^data\:image\/webp/) === 0) return "image/webp";
  if (uri.search(/\.ktx2($|\?)/i) > 0 || uri.search(/^data\:image\/ktx2/) === 0) return "image/ktx2";
  return "image/png";
}
const _identityMatrix = new Matrix4();
class GLTFParser {
  constructor(json = {}, options = {}) {
    this.json = json;
    this.extensions = {};
    this.plugins = {};
    this.options = options;
    this.cache = new GLTFRegistry();
    this.associations = /* @__PURE__ */ new Map();
    this.primitiveCache = {};
    this.nodeCache = {};
    this.meshCache = { refs: {}, uses: {} };
    this.cameraCache = { refs: {}, uses: {} };
    this.lightCache = { refs: {}, uses: {} };
    this.sourceCache = {};
    this.textureCache = {};
    this.nodeNamesUsed = {};
    let isSafari = false;
    let safariVersion = -1;
    let isFirefox = false;
    let firefoxVersion = -1;
    if (typeof navigator !== "undefined" && typeof navigator.userAgent !== "undefined") {
      const userAgent = navigator.userAgent;
      isSafari = /^((?!chrome|android).)*safari/i.test(userAgent) === true;
      const safariMatch = userAgent.match(/Version\/(\d+)/);
      safariVersion = isSafari && safariMatch ? parseInt(safariMatch[1], 10) : -1;
      isFirefox = userAgent.indexOf("Firefox") > -1;
      firefoxVersion = isFirefox ? userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    if (typeof createImageBitmap === "undefined" || isSafari && safariVersion < 17 || isFirefox && firefoxVersion < 98) {
      this.textureLoader = new TextureLoader(this.options.manager);
    } else {
      this.textureLoader = new ImageBitmapLoader(this.options.manager);
    }
    this.textureLoader.setCrossOrigin(this.options.crossOrigin);
    this.textureLoader.setRequestHeader(this.options.requestHeader);
    this.fileLoader = new FileLoader(this.options.manager);
    this.fileLoader.setResponseType("arraybuffer");
    if (this.options.crossOrigin === "use-credentials") {
      this.fileLoader.setWithCredentials(true);
    }
  }
  setExtensions(extensions) {
    this.extensions = extensions;
  }
  setPlugins(plugins) {
    this.plugins = plugins;
  }
  parse(onLoad, onError) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;
    this.cache.removeAll();
    this.nodeCache = {};
    this._invokeAll(function(ext) {
      return ext._markDefs && ext._markDefs();
    });
    Promise.all(this._invokeAll(function(ext) {
      return ext.beforeRoot && ext.beforeRoot();
    })).then(function() {
      return Promise.all([
        parser.getDependencies("scene"),
        parser.getDependencies("animation"),
        parser.getDependencies("camera")
      ]);
    }).then(function(dependencies) {
      const result = {
        scene: dependencies[0][json.scene || 0],
        scenes: dependencies[0],
        animations: dependencies[1],
        cameras: dependencies[2],
        asset: json.asset,
        parser,
        userData: {}
      };
      addUnknownExtensionsToUserData(extensions, result, json);
      assignExtrasToUserData(result, json);
      return Promise.all(parser._invokeAll(function(ext) {
        return ext.afterRoot && ext.afterRoot(result);
      })).then(function() {
        for (const scene of result.scenes) {
          scene.updateMatrixWorld();
        }
        onLoad(result);
      });
    }).catch(onError);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   *
   * @private
   */
  _markDefs() {
    const nodeDefs = this.json.nodes || [];
    const skinDefs = this.json.skins || [];
    const meshDefs = this.json.meshes || [];
    for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
      const joints = skinDefs[skinIndex].joints;
      for (let i = 0, il = joints.length; i < il; i++) {
        nodeDefs[joints[i]].isBone = true;
      }
    }
    for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
      const nodeDef = nodeDefs[nodeIndex];
      if (nodeDef.mesh !== void 0) {
        this._addNodeRef(this.meshCache, nodeDef.mesh);
        if (nodeDef.skin !== void 0) {
          meshDefs[nodeDef.mesh].isSkinnedMesh = true;
        }
      }
      if (nodeDef.camera !== void 0) {
        this._addNodeRef(this.cameraCache, nodeDef.camera);
      }
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   *
   * @private
   * @param {Object} cache
   * @param {Object3D} index
   */
  _addNodeRef(cache, index) {
    if (index === void 0) return;
    if (cache.refs[index] === void 0) {
      cache.refs[index] = cache.uses[index] = 0;
    }
    cache.refs[index]++;
  }
  /**
   * Returns a reference to a shared resource, cloning it if necessary.
   *
   * @private
   * @param {Object} cache
   * @param {number} index
   * @param {Object} object
   * @return {Object}
   */
  _getNodeRef(cache, index, object) {
    if (cache.refs[index] <= 1) return object;
    const ref2 = object.clone();
    const updateMappings = (original, clone2) => {
      const mappings = this.associations.get(original);
      if (mappings != null) {
        this.associations.set(clone2, mappings);
      }
      for (const [i, child] of original.children.entries()) {
        updateMappings(child, clone2.children[i]);
      }
    };
    updateMappings(object, ref2);
    ref2.name += "_instance_" + cache.uses[index]++;
    return ref2;
  }
  _invokeOne(func) {
    const extensions = Object.values(this.plugins);
    extensions.push(this);
    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);
      if (result) return result;
    }
    return null;
  }
  _invokeAll(func) {
    const extensions = Object.values(this.plugins);
    extensions.unshift(this);
    const pending = [];
    for (let i = 0; i < extensions.length; i++) {
      const result = func(extensions[i]);
      if (result) pending.push(result);
    }
    return pending;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(type, index) {
    const cacheKey = type + ":" + index;
    let dependency = this.cache.get(cacheKey);
    if (!dependency) {
      switch (type) {
        case "scene":
          dependency = this.loadScene(index);
          break;
        case "node":
          dependency = this._invokeOne(function(ext) {
            return ext.loadNode && ext.loadNode(index);
          });
          break;
        case "mesh":
          dependency = this._invokeOne(function(ext) {
            return ext.loadMesh && ext.loadMesh(index);
          });
          break;
        case "accessor":
          dependency = this.loadAccessor(index);
          break;
        case "bufferView":
          dependency = this._invokeOne(function(ext) {
            return ext.loadBufferView && ext.loadBufferView(index);
          });
          break;
        case "buffer":
          dependency = this.loadBuffer(index);
          break;
        case "material":
          dependency = this._invokeOne(function(ext) {
            return ext.loadMaterial && ext.loadMaterial(index);
          });
          break;
        case "texture":
          dependency = this._invokeOne(function(ext) {
            return ext.loadTexture && ext.loadTexture(index);
          });
          break;
        case "skin":
          dependency = this.loadSkin(index);
          break;
        case "animation":
          dependency = this._invokeOne(function(ext) {
            return ext.loadAnimation && ext.loadAnimation(index);
          });
          break;
        case "camera":
          dependency = this.loadCamera(index);
          break;
        default:
          dependency = this._invokeOne(function(ext) {
            return ext != this && ext.getDependency && ext.getDependency(type, index);
          });
          if (!dependency) {
            throw new Error("Unknown type: " + type);
          }
          break;
      }
      this.cache.add(cacheKey, dependency);
    }
    return dependency;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(type) {
    let dependencies = this.cache.get(type);
    if (!dependencies) {
      const parser = this;
      const defs = this.json[type + (type === "mesh" ? "es" : "s")] || [];
      dependencies = Promise.all(defs.map(function(def, index) {
        return parser.getDependency(type, index);
      }));
      this.cache.add(type, dependencies);
    }
    return dependencies;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(bufferIndex) {
    const bufferDef = this.json.buffers[bufferIndex];
    const loader = this.fileLoader;
    if (bufferDef.type && bufferDef.type !== "arraybuffer") {
      throw new Error("THREE.GLTFLoader: " + bufferDef.type + " buffer type is not supported.");
    }
    if (bufferDef.uri === void 0 && bufferIndex === 0) {
      return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
    }
    const options = this.options;
    return new Promise(function(resolve, reject) {
      loader.load(LoaderUtils.resolveURL(bufferDef.uri, options.path), resolve, void 0, function() {
        reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(bufferViewIndex) {
    const bufferViewDef = this.json.bufferViews[bufferViewIndex];
    return this.getDependency("buffer", bufferViewDef.buffer).then(function(buffer) {
      const byteLength = bufferViewDef.byteLength || 0;
      const byteOffset = bufferViewDef.byteOffset || 0;
      return buffer.slice(byteOffset, byteOffset + byteLength);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   *
   * @private
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(accessorIndex) {
    const parser = this;
    const json = this.json;
    const accessorDef = this.json.accessors[accessorIndex];
    if (accessorDef.bufferView === void 0 && accessorDef.sparse === void 0) {
      const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
      const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
      const normalized = accessorDef.normalized === true;
      const array = new TypedArray(accessorDef.count * itemSize);
      return Promise.resolve(new BufferAttribute(array, itemSize, normalized));
    }
    const pendingBufferViews = [];
    if (accessorDef.bufferView !== void 0) {
      pendingBufferViews.push(this.getDependency("bufferView", accessorDef.bufferView));
    } else {
      pendingBufferViews.push(null);
    }
    if (accessorDef.sparse !== void 0) {
      pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.indices.bufferView));
      pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.values.bufferView));
    }
    return Promise.all(pendingBufferViews).then(function(bufferViews) {
      const bufferView = bufferViews[0];
      const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
      const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
      const elementBytes = TypedArray.BYTES_PER_ELEMENT;
      const itemBytes = elementBytes * itemSize;
      const byteOffset = accessorDef.byteOffset || 0;
      const byteStride = accessorDef.bufferView !== void 0 ? json.bufferViews[accessorDef.bufferView].byteStride : void 0;
      const normalized = accessorDef.normalized === true;
      let array, bufferAttribute;
      if (byteStride && byteStride !== itemBytes) {
        const ibSlice = Math.floor(byteOffset / byteStride);
        const ibCacheKey = "InterleavedBuffer:" + accessorDef.bufferView + ":" + accessorDef.componentType + ":" + ibSlice + ":" + accessorDef.count;
        let ib = parser.cache.get(ibCacheKey);
        if (!ib) {
          array = new TypedArray(bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes);
          ib = new InterleavedBuffer(array, byteStride / elementBytes);
          parser.cache.add(ibCacheKey, ib);
        }
        bufferAttribute = new InterleavedBufferAttribute(ib, itemSize, byteOffset % byteStride / elementBytes, normalized);
      } else {
        if (bufferView === null) {
          array = new TypedArray(accessorDef.count * itemSize);
        } else {
          array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
        }
        bufferAttribute = new BufferAttribute(array, itemSize, normalized);
      }
      if (accessorDef.sparse !== void 0) {
        const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
        const TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
        const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
        const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
        const sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
        const sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
        if (bufferView !== null) {
          bufferAttribute = new BufferAttribute(bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized);
        }
        bufferAttribute.normalized = false;
        for (let i = 0, il = sparseIndices.length; i < il; i++) {
          const index = sparseIndices[i];
          bufferAttribute.setX(index, sparseValues[i * itemSize]);
          if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
          if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
          if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
          if (itemSize >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        bufferAttribute.normalized = normalized;
      }
      return bufferAttribute;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   *
   * @private
   * @param {number} textureIndex
   * @return {Promise<?Texture>}
   */
  loadTexture(textureIndex) {
    const json = this.json;
    const options = this.options;
    const textureDef = json.textures[textureIndex];
    const sourceIndex = textureDef.source;
    const sourceDef = json.images[sourceIndex];
    let loader = this.textureLoader;
    if (sourceDef.uri) {
      const handler = options.manager.getHandler(sourceDef.uri);
      if (handler !== null) loader = handler;
    }
    return this.loadTextureImage(textureIndex, sourceIndex, loader);
  }
  loadTextureImage(textureIndex, sourceIndex, loader) {
    const parser = this;
    const json = this.json;
    const textureDef = json.textures[textureIndex];
    const sourceDef = json.images[sourceIndex];
    const cacheKey = (sourceDef.uri || sourceDef.bufferView) + ":" + textureDef.sampler;
    if (this.textureCache[cacheKey]) {
      return this.textureCache[cacheKey];
    }
    const promise = this.loadImageSource(sourceIndex, loader).then(function(texture) {
      texture.flipY = false;
      texture.name = textureDef.name || sourceDef.name || "";
      if (texture.name === "" && typeof sourceDef.uri === "string" && sourceDef.uri.startsWith("data:image/") === false) {
        texture.name = sourceDef.uri;
      }
      const samplers = json.samplers || {};
      const sampler = samplers[textureDef.sampler] || {};
      texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || LinearFilter;
      texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || LinearMipmapLinearFilter;
      texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || RepeatWrapping;
      texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || RepeatWrapping;
      texture.generateMipmaps = !texture.isCompressedTexture && texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter;
      parser.associations.set(texture, { textures: textureIndex });
      return texture;
    }).catch(function() {
      return null;
    });
    this.textureCache[cacheKey] = promise;
    return promise;
  }
  loadImageSource(sourceIndex, loader) {
    const parser = this;
    const json = this.json;
    const options = this.options;
    if (this.sourceCache[sourceIndex] !== void 0) {
      return this.sourceCache[sourceIndex].then((texture) => texture.clone());
    }
    const sourceDef = json.images[sourceIndex];
    const URL2 = self.URL || self.webkitURL;
    let sourceURI = sourceDef.uri || "";
    let isObjectURL = false;
    if (sourceDef.bufferView !== void 0) {
      sourceURI = parser.getDependency("bufferView", sourceDef.bufferView).then(function(bufferView) {
        isObjectURL = true;
        const blob = new Blob([bufferView], { type: sourceDef.mimeType });
        sourceURI = URL2.createObjectURL(blob);
        return sourceURI;
      });
    } else if (sourceDef.uri === void 0) {
      throw new Error("THREE.GLTFLoader: Image " + sourceIndex + " is missing URI and bufferView");
    }
    const promise = Promise.resolve(sourceURI).then(function(sourceURI2) {
      return new Promise(function(resolve, reject) {
        let onLoad = resolve;
        if (loader.isImageBitmapLoader === true) {
          onLoad = function(imageBitmap) {
            const texture = new Texture(imageBitmap);
            texture.needsUpdate = true;
            resolve(texture);
          };
        }
        loader.load(LoaderUtils.resolveURL(sourceURI2, options.path), onLoad, void 0, reject);
      });
    }).then(function(texture) {
      if (isObjectURL === true) {
        URL2.revokeObjectURL(sourceURI);
      }
      assignExtrasToUserData(texture, sourceDef);
      texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType(sourceDef.uri);
      return texture;
    }).catch(function(error) {
      console.error("THREE.GLTFLoader: Couldn't load texture", sourceURI);
      throw error;
    });
    this.sourceCache[sourceIndex] = promise;
    return promise;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   *
   * @private
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @param {string} [colorSpace]
   * @return {Promise<Texture>}
   */
  assignTexture(materialParams, mapName, mapDef, colorSpace) {
    const parser = this;
    return this.getDependency("texture", mapDef.index).then(function(texture) {
      if (!texture) return null;
      if (mapDef.texCoord !== void 0 && mapDef.texCoord > 0) {
        texture = texture.clone();
        texture.channel = mapDef.texCoord;
      }
      if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
        const transform = mapDef.extensions !== void 0 ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : void 0;
        if (transform) {
          const gltfReference = parser.associations.get(texture);
          texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform);
          parser.associations.set(texture, gltfReference);
        }
      }
      if (colorSpace !== void 0) {
        texture.colorSpace = colorSpace;
      }
      materialParams[mapName] = texture;
      return texture;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   *
   * @private
   * @param {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(mesh) {
    const geometry = mesh.geometry;
    let material = mesh.material;
    const useDerivativeTangents = geometry.attributes.tangent === void 0;
    const useVertexColors = geometry.attributes.color !== void 0;
    const useFlatShading = geometry.attributes.normal === void 0;
    if (mesh.isPoints) {
      const cacheKey = "PointsMaterial:" + material.uuid;
      let pointsMaterial = this.cache.get(cacheKey);
      if (!pointsMaterial) {
        pointsMaterial = new PointsMaterial();
        Material.prototype.copy.call(pointsMaterial, material);
        pointsMaterial.color.copy(material.color);
        pointsMaterial.map = material.map;
        pointsMaterial.sizeAttenuation = false;
        this.cache.add(cacheKey, pointsMaterial);
      }
      material = pointsMaterial;
    } else if (mesh.isLine) {
      const cacheKey = "LineBasicMaterial:" + material.uuid;
      let lineMaterial = this.cache.get(cacheKey);
      if (!lineMaterial) {
        lineMaterial = new LineBasicMaterial();
        Material.prototype.copy.call(lineMaterial, material);
        lineMaterial.color.copy(material.color);
        lineMaterial.map = material.map;
        this.cache.add(cacheKey, lineMaterial);
      }
      material = lineMaterial;
    }
    if (useDerivativeTangents || useVertexColors || useFlatShading) {
      let cacheKey = "ClonedMaterial:" + material.uuid + ":";
      if (useDerivativeTangents) cacheKey += "derivative-tangents:";
      if (useVertexColors) cacheKey += "vertex-colors:";
      if (useFlatShading) cacheKey += "flat-shading:";
      let cachedMaterial = this.cache.get(cacheKey);
      if (!cachedMaterial) {
        cachedMaterial = material.clone();
        if (useVertexColors) cachedMaterial.vertexColors = true;
        if (useFlatShading) cachedMaterial.flatShading = true;
        if (useDerivativeTangents) {
          if (cachedMaterial.normalScale) cachedMaterial.normalScale.y *= -1;
          if (cachedMaterial.clearcoatNormalScale) cachedMaterial.clearcoatNormalScale.y *= -1;
        }
        this.cache.add(cacheKey, cachedMaterial);
        this.associations.set(cachedMaterial, this.associations.get(material));
      }
      material = cachedMaterial;
    }
    mesh.material = material;
  }
  getMaterialType() {
    return MeshStandardMaterial;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   *
   * @private
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(materialIndex) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;
    const materialDef = json.materials[materialIndex];
    let materialType;
    const materialParams = {};
    const materialExtensions = materialDef.extensions || {};
    const pending = [];
    if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
      const kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
      materialType = kmuExtension.getMaterialType();
      pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
    } else {
      const metallicRoughness = materialDef.pbrMetallicRoughness || {};
      materialParams.color = new Color(1, 1, 1);
      materialParams.opacity = 1;
      if (Array.isArray(metallicRoughness.baseColorFactor)) {
        const array = metallicRoughness.baseColorFactor;
        materialParams.color.setRGB(array[0], array[1], array[2], LinearSRGBColorSpace);
        materialParams.opacity = array[3];
      }
      if (metallicRoughness.baseColorTexture !== void 0) {
        pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture, SRGBColorSpace));
      }
      materialParams.metalness = metallicRoughness.metallicFactor !== void 0 ? metallicRoughness.metallicFactor : 1;
      materialParams.roughness = metallicRoughness.roughnessFactor !== void 0 ? metallicRoughness.roughnessFactor : 1;
      if (metallicRoughness.metallicRoughnessTexture !== void 0) {
        pending.push(parser.assignTexture(materialParams, "metalnessMap", metallicRoughness.metallicRoughnessTexture));
        pending.push(parser.assignTexture(materialParams, "roughnessMap", metallicRoughness.metallicRoughnessTexture));
      }
      materialType = this._invokeOne(function(ext) {
        return ext.getMaterialType && ext.getMaterialType(materialIndex);
      });
      pending.push(Promise.all(this._invokeAll(function(ext) {
        return ext.extendMaterialParams && ext.extendMaterialParams(materialIndex, materialParams);
      })));
    }
    if (materialDef.doubleSided === true) {
      materialParams.side = DoubleSide;
    }
    const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
    if (alphaMode === ALPHA_MODES.BLEND) {
      materialParams.transparent = true;
      materialParams.depthWrite = false;
    } else {
      materialParams.transparent = false;
      if (alphaMode === ALPHA_MODES.MASK) {
        materialParams.alphaTest = materialDef.alphaCutoff !== void 0 ? materialDef.alphaCutoff : 0.5;
      }
    }
    if (materialDef.normalTexture !== void 0 && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, "normalMap", materialDef.normalTexture));
      materialParams.normalScale = new Vector2(1, 1);
      if (materialDef.normalTexture.scale !== void 0) {
        const scale = materialDef.normalTexture.scale;
        materialParams.normalScale.set(scale, scale);
      }
    }
    if (materialDef.occlusionTexture !== void 0 && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, "aoMap", materialDef.occlusionTexture));
      if (materialDef.occlusionTexture.strength !== void 0) {
        materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
      }
    }
    if (materialDef.emissiveFactor !== void 0 && materialType !== MeshBasicMaterial) {
      const emissiveFactor = materialDef.emissiveFactor;
      materialParams.emissive = new Color().setRGB(emissiveFactor[0], emissiveFactor[1], emissiveFactor[2], LinearSRGBColorSpace);
    }
    if (materialDef.emissiveTexture !== void 0 && materialType !== MeshBasicMaterial) {
      pending.push(parser.assignTexture(materialParams, "emissiveMap", materialDef.emissiveTexture, SRGBColorSpace));
    }
    return Promise.all(pending).then(function() {
      const material = new materialType(materialParams);
      if (materialDef.name) material.name = materialDef.name;
      assignExtrasToUserData(material, materialDef);
      parser.associations.set(material, { materials: materialIndex });
      if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef);
      return material;
    });
  }
  /**
   * When Object3D instances are targeted by animation, they need unique names.
   *
   * @private
   * @param {string} originalName
   * @return {string}
   */
  createUniqueName(originalName) {
    const sanitizedName = PropertyBinding.sanitizeNodeName(originalName || "");
    if (sanitizedName in this.nodeNamesUsed) {
      return sanitizedName + "_" + ++this.nodeNamesUsed[sanitizedName];
    } else {
      this.nodeNamesUsed[sanitizedName] = 0;
      return sanitizedName;
    }
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @private
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(primitives) {
    const parser = this;
    const extensions = this.extensions;
    const cache = this.primitiveCache;
    function createDracoPrimitive(primitive) {
      return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(primitive, parser).then(function(geometry) {
        return addPrimitiveAttributes(geometry, primitive, parser);
      });
    }
    const pending = [];
    for (let i = 0, il = primitives.length; i < il; i++) {
      const primitive = primitives[i];
      const cacheKey = createPrimitiveKey(primitive);
      const cached = cache[cacheKey];
      if (cached) {
        pending.push(cached.promise);
      } else {
        let geometryPromise;
        if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
          geometryPromise = createDracoPrimitive(primitive);
        } else {
          geometryPromise = addPrimitiveAttributes(new BufferGeometry(), primitive, parser);
        }
        cache[cacheKey] = { primitive, promise: geometryPromise };
        pending.push(geometryPromise);
      }
    }
    return Promise.all(pending);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   *
   * @private
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh|Line|Points>}
   */
  loadMesh(meshIndex) {
    const parser = this;
    const json = this.json;
    const extensions = this.extensions;
    const meshDef = json.meshes[meshIndex];
    const primitives = meshDef.primitives;
    const pending = [];
    for (let i = 0, il = primitives.length; i < il; i++) {
      const material = primitives[i].material === void 0 ? createDefaultMaterial(this.cache) : this.getDependency("material", primitives[i].material);
      pending.push(material);
    }
    pending.push(parser.loadGeometries(primitives));
    return Promise.all(pending).then(function(results) {
      const materials = results.slice(0, results.length - 1);
      const geometries = results[results.length - 1];
      const meshes = [];
      for (let i = 0, il = geometries.length; i < il; i++) {
        const geometry = geometries[i];
        const primitive = primitives[i];
        let mesh;
        const material = materials[i];
        if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN || primitive.mode === void 0) {
          mesh = meshDef.isSkinnedMesh === true ? new SkinnedMesh(geometry, material) : new Mesh(geometry, material);
          if (mesh.isSkinnedMesh === true) {
            mesh.normalizeSkinWeights();
          }
          if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
            mesh.geometry = toTrianglesDrawMode(mesh.geometry, TriangleStripDrawMode);
          } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
            mesh.geometry = toTrianglesDrawMode(mesh.geometry, TriangleFanDrawMode);
          }
        } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
          mesh = new LineSegments(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
          mesh = new Line(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
          mesh = new LineLoop(geometry, material);
        } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
          mesh = new Points(geometry, material);
        } else {
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + primitive.mode);
        }
        if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
          updateMorphTargets(mesh, meshDef);
        }
        mesh.name = parser.createUniqueName(meshDef.name || "mesh_" + meshIndex);
        assignExtrasToUserData(mesh, meshDef);
        if (primitive.extensions) addUnknownExtensionsToUserData(extensions, mesh, primitive);
        parser.assignFinalMaterial(mesh);
        meshes.push(mesh);
      }
      for (let i = 0, il = meshes.length; i < il; i++) {
        parser.associations.set(meshes[i], {
          meshes: meshIndex,
          primitives: i
        });
      }
      if (meshes.length === 1) {
        if (meshDef.extensions) addUnknownExtensionsToUserData(extensions, meshes[0], meshDef);
        return meshes[0];
      }
      const group = new Group();
      if (meshDef.extensions) addUnknownExtensionsToUserData(extensions, group, meshDef);
      parser.associations.set(group, { meshes: meshIndex });
      for (let i = 0, il = meshes.length; i < il; i++) {
        group.add(meshes[i]);
      }
      return group;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   *
   * @private
   * @param {number} cameraIndex
   * @return {Promise<Camera>|undefined}
   */
  loadCamera(cameraIndex) {
    let camera;
    const cameraDef = this.json.cameras[cameraIndex];
    const params = cameraDef[cameraDef.type];
    if (!params) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    if (cameraDef.type === "perspective") {
      camera = new PerspectiveCamera(MathUtils.radToDeg(params.yfov), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6);
    } else if (cameraDef.type === "orthographic") {
      camera = new OrthographicCamera(-params.xmag, params.xmag, params.ymag, -params.ymag, params.znear, params.zfar);
    }
    if (cameraDef.name) camera.name = this.createUniqueName(cameraDef.name);
    assignExtrasToUserData(camera, cameraDef);
    return Promise.resolve(camera);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   *
   * @private
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(skinIndex) {
    const skinDef = this.json.skins[skinIndex];
    const pending = [];
    for (let i = 0, il = skinDef.joints.length; i < il; i++) {
      pending.push(this._loadNodeShallow(skinDef.joints[i]));
    }
    if (skinDef.inverseBindMatrices !== void 0) {
      pending.push(this.getDependency("accessor", skinDef.inverseBindMatrices));
    } else {
      pending.push(null);
    }
    return Promise.all(pending).then(function(results) {
      const inverseBindMatrices = results.pop();
      const jointNodes = results;
      const bones = [];
      const boneInverses = [];
      for (let i = 0, il = jointNodes.length; i < il; i++) {
        const jointNode = jointNodes[i];
        if (jointNode) {
          bones.push(jointNode);
          const mat = new Matrix4();
          if (inverseBindMatrices !== null) {
            mat.fromArray(inverseBindMatrices.array, i * 16);
          }
          boneInverses.push(mat);
        } else {
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', skinDef.joints[i]);
        }
      }
      return new Skeleton(bones, boneInverses);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   *
   * @private
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(animationIndex) {
    const json = this.json;
    const parser = this;
    const animationDef = json.animations[animationIndex];
    const animationName = animationDef.name ? animationDef.name : "animation_" + animationIndex;
    const pendingNodes = [];
    const pendingInputAccessors = [];
    const pendingOutputAccessors = [];
    const pendingSamplers = [];
    const pendingTargets = [];
    for (let i = 0, il = animationDef.channels.length; i < il; i++) {
      const channel = animationDef.channels[i];
      const sampler = animationDef.samplers[channel.sampler];
      const target = channel.target;
      const name = target.node;
      const input = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.input] : sampler.input;
      const output = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.output] : sampler.output;
      if (target.node === void 0) continue;
      pendingNodes.push(this.getDependency("node", name));
      pendingInputAccessors.push(this.getDependency("accessor", input));
      pendingOutputAccessors.push(this.getDependency("accessor", output));
      pendingSamplers.push(sampler);
      pendingTargets.push(target);
    }
    return Promise.all([
      Promise.all(pendingNodes),
      Promise.all(pendingInputAccessors),
      Promise.all(pendingOutputAccessors),
      Promise.all(pendingSamplers),
      Promise.all(pendingTargets)
    ]).then(function(dependencies) {
      const nodes = dependencies[0];
      const inputAccessors = dependencies[1];
      const outputAccessors = dependencies[2];
      const samplers = dependencies[3];
      const targets = dependencies[4];
      const tracks = [];
      for (let i = 0, il = nodes.length; i < il; i++) {
        const node = nodes[i];
        const inputAccessor = inputAccessors[i];
        const outputAccessor = outputAccessors[i];
        const sampler = samplers[i];
        const target = targets[i];
        if (node === void 0) continue;
        if (node.updateMatrix) {
          node.updateMatrix();
        }
        const createdTracks = parser._createAnimationTracks(node, inputAccessor, outputAccessor, sampler, target);
        if (createdTracks) {
          for (let k = 0; k < createdTracks.length; k++) {
            tracks.push(createdTracks[k]);
          }
        }
      }
      const animation = new AnimationClip(animationName, void 0, tracks);
      assignExtrasToUserData(animation, animationDef);
      return animation;
    });
  }
  createNodeMesh(nodeIndex) {
    const json = this.json;
    const parser = this;
    const nodeDef = json.nodes[nodeIndex];
    if (nodeDef.mesh === void 0) return null;
    return parser.getDependency("mesh", nodeDef.mesh).then(function(mesh) {
      const node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh);
      if (nodeDef.weights !== void 0) {
        node.traverse(function(o) {
          if (!o.isMesh) return;
          for (let i = 0, il = nodeDef.weights.length; i < il; i++) {
            o.morphTargetInfluences[i] = nodeDef.weights[i];
          }
        });
      }
      return node;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   *
   * @private
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(nodeIndex) {
    const json = this.json;
    const parser = this;
    const nodeDef = json.nodes[nodeIndex];
    const nodePending = parser._loadNodeShallow(nodeIndex);
    const childPending = [];
    const childrenDef = nodeDef.children || [];
    for (let i = 0, il = childrenDef.length; i < il; i++) {
      childPending.push(parser.getDependency("node", childrenDef[i]));
    }
    const skeletonPending = nodeDef.skin === void 0 ? Promise.resolve(null) : parser.getDependency("skin", nodeDef.skin);
    return Promise.all([
      nodePending,
      Promise.all(childPending),
      skeletonPending
    ]).then(function(results) {
      const node = results[0];
      const children = results[1];
      const skeleton = results[2];
      if (skeleton !== null) {
        node.traverse(function(mesh) {
          if (!mesh.isSkinnedMesh) return;
          mesh.bind(skeleton, _identityMatrix);
        });
      }
      for (let i = 0, il = children.length; i < il; i++) {
        node.add(children[i]);
      }
      if (node.userData.pivot !== void 0 && children.length > 0) {
        const pivot = node.userData.pivot;
        const pivotChild = children[0];
        node.pivot = new Vector3().fromArray(pivot);
        node.position.x -= pivot[0];
        node.position.y -= pivot[1];
        node.position.z -= pivot[2];
        pivotChild.position.set(0, 0, 0);
        delete node.userData.pivot;
      }
      return node;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(nodeIndex) {
    const json = this.json;
    const extensions = this.extensions;
    const parser = this;
    if (this.nodeCache[nodeIndex] !== void 0) {
      return this.nodeCache[nodeIndex];
    }
    const nodeDef = json.nodes[nodeIndex];
    const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : "";
    const pending = [];
    const meshPromise = parser._invokeOne(function(ext) {
      return ext.createNodeMesh && ext.createNodeMesh(nodeIndex);
    });
    if (meshPromise) {
      pending.push(meshPromise);
    }
    if (nodeDef.camera !== void 0) {
      pending.push(parser.getDependency("camera", nodeDef.camera).then(function(camera) {
        return parser._getNodeRef(parser.cameraCache, nodeDef.camera, camera);
      }));
    }
    parser._invokeAll(function(ext) {
      return ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex);
    }).forEach(function(promise) {
      pending.push(promise);
    });
    this.nodeCache[nodeIndex] = Promise.all(pending).then(function(objects) {
      let node;
      if (nodeDef.isBone === true) {
        node = new Bone();
      } else if (objects.length > 1) {
        node = new Group();
      } else if (objects.length === 1) {
        node = objects[0];
      } else {
        node = new Object3D();
      }
      if (node !== objects[0]) {
        for (let i = 0, il = objects.length; i < il; i++) {
          node.add(objects[i]);
        }
      }
      if (nodeDef.name) {
        node.userData.name = nodeDef.name;
        node.name = nodeName;
      }
      assignExtrasToUserData(node, nodeDef);
      if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef);
      if (nodeDef.matrix !== void 0) {
        const matrix = new Matrix4();
        matrix.fromArray(nodeDef.matrix);
        node.applyMatrix4(matrix);
      } else {
        if (nodeDef.translation !== void 0) {
          node.position.fromArray(nodeDef.translation);
        }
        if (nodeDef.rotation !== void 0) {
          node.quaternion.fromArray(nodeDef.rotation);
        }
        if (nodeDef.scale !== void 0) {
          node.scale.fromArray(nodeDef.scale);
        }
      }
      if (!parser.associations.has(node)) {
        parser.associations.set(node, {});
      } else if (nodeDef.mesh !== void 0 && parser.meshCache.refs[nodeDef.mesh] > 1) {
        const mapping = parser.associations.get(node);
        parser.associations.set(node, { ...mapping });
      }
      parser.associations.get(node).nodes = nodeIndex;
      return node;
    });
    return this.nodeCache[nodeIndex];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   *
   * @private
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(sceneIndex) {
    const extensions = this.extensions;
    const sceneDef = this.json.scenes[sceneIndex];
    const parser = this;
    const scene = new Group();
    if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);
    assignExtrasToUserData(scene, sceneDef);
    if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef);
    const nodeIds = sceneDef.nodes || [];
    const pending = [];
    for (let i = 0, il = nodeIds.length; i < il; i++) {
      pending.push(parser.getDependency("node", nodeIds[i]));
    }
    return Promise.all(pending).then(function(nodes) {
      for (let i = 0, il = nodes.length; i < il; i++) {
        const node = nodes[i];
        if (node.parent !== null) {
          scene.add(clone(node));
        } else {
          scene.add(node);
        }
      }
      const reduceAssociations = (node) => {
        const reducedAssociations = /* @__PURE__ */ new Map();
        for (const [key, value] of parser.associations) {
          if (key instanceof Material || key instanceof Texture) {
            reducedAssociations.set(key, value);
          }
        }
        node.traverse((node2) => {
          const mappings = parser.associations.get(node2);
          if (mappings != null) {
            reducedAssociations.set(node2, mappings);
          }
        });
        return reducedAssociations;
      };
      parser.associations = reduceAssociations(scene);
      return scene;
    });
  }
  _createAnimationTracks(node, inputAccessor, outputAccessor, sampler, target) {
    const tracks = [];
    const targetName = node.name ? node.name : node.uuid;
    const targetNames = [];
    function collectMorphTargets(object) {
      if (object.morphTargetInfluences) {
        targetNames.push(object.name ? object.name : object.uuid);
      }
    }
    if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
      collectMorphTargets(node);
      if (node.isGroup) {
        node.children.forEach(collectMorphTargets);
      }
    } else {
      targetNames.push(targetName);
    }
    let TypedKeyframeTrack;
    switch (PATH_PROPERTIES[target.path]) {
      case PATH_PROPERTIES.weights:
        TypedKeyframeTrack = NumberKeyframeTrack;
        break;
      case PATH_PROPERTIES.rotation:
        TypedKeyframeTrack = QuaternionKeyframeTrack;
        break;
      case PATH_PROPERTIES.translation:
      case PATH_PROPERTIES.scale:
        TypedKeyframeTrack = VectorKeyframeTrack;
        break;
      default:
        switch (outputAccessor.itemSize) {
          case 1:
            TypedKeyframeTrack = NumberKeyframeTrack;
            break;
          case 2:
          case 3:
          default:
            TypedKeyframeTrack = VectorKeyframeTrack;
            break;
        }
        break;
    }
    const interpolation = sampler.interpolation !== void 0 ? INTERPOLATION[sampler.interpolation] : InterpolateLinear;
    const outputArray = this._getArrayFromAccessor(outputAccessor);
    for (let j = 0, jl = targetNames.length; j < jl; j++) {
      const track = new TypedKeyframeTrack(
        targetNames[j] + "." + PATH_PROPERTIES[target.path],
        inputAccessor.array,
        outputArray,
        interpolation
      );
      if (sampler.interpolation === "CUBICSPLINE") {
        this._createCubicSplineTrackInterpolant(track);
      }
      tracks.push(track);
    }
    return tracks;
  }
  _getArrayFromAccessor(accessor) {
    let outputArray = accessor.array;
    if (accessor.normalized) {
      const scale = getNormalizedComponentScale(outputArray.constructor);
      const scaled = new Float32Array(outputArray.length);
      for (let j = 0, jl = outputArray.length; j < jl; j++) {
        scaled[j] = outputArray[j] * scale;
      }
      outputArray = scaled;
    }
    return outputArray;
  }
  _createCubicSplineTrackInterpolant(track) {
    track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
      const interpolantType = this instanceof QuaternionKeyframeTrack ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;
      return new interpolantType(this.times, this.values, this.getValueSize() / 3, result);
    };
    track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
  }
}
function computeBounds(geometry, primitiveDef, parser) {
  const attributes = primitiveDef.attributes;
  const box = new Box3();
  if (attributes.POSITION !== void 0) {
    const accessor = parser.json.accessors[attributes.POSITION];
    const min = accessor.min;
    const max = accessor.max;
    if (min !== void 0 && max !== void 0) {
      box.set(
        new Vector3(min[0], min[1], min[2]),
        new Vector3(max[0], max[1], max[2])
      );
      if (accessor.normalized) {
        const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
        box.min.multiplyScalar(boxScale);
        box.max.multiplyScalar(boxScale);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else {
    return;
  }
  const targets = primitiveDef.targets;
  if (targets !== void 0) {
    const maxDisplacement = new Vector3();
    const vector = new Vector3();
    for (let i = 0, il = targets.length; i < il; i++) {
      const target = targets[i];
      if (target.POSITION !== void 0) {
        const accessor = parser.json.accessors[target.POSITION];
        const min = accessor.min;
        const max = accessor.max;
        if (min !== void 0 && max !== void 0) {
          vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
          vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
          vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));
          if (accessor.normalized) {
            const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
            vector.multiplyScalar(boxScale);
          }
          maxDisplacement.max(vector);
        } else {
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
        }
      }
    }
    box.expandByVector(maxDisplacement);
  }
  geometry.boundingBox = box;
  const sphere = new Sphere();
  box.getCenter(sphere.center);
  sphere.radius = box.min.distanceTo(box.max) / 2;
  geometry.boundingSphere = sphere;
}
function addPrimitiveAttributes(geometry, primitiveDef, parser) {
  const attributes = primitiveDef.attributes;
  const pending = [];
  function assignAttributeAccessor(accessorIndex, attributeName) {
    return parser.getDependency("accessor", accessorIndex).then(function(accessor) {
      geometry.setAttribute(attributeName, accessor);
    });
  }
  for (const gltfAttributeName in attributes) {
    const threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase();
    if (threeAttributeName in geometry.attributes) continue;
    pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName));
  }
  if (primitiveDef.indices !== void 0 && !geometry.index) {
    const accessor = parser.getDependency("accessor", primitiveDef.indices).then(function(accessor2) {
      geometry.setIndex(accessor2);
    });
    pending.push(accessor);
  }
  if (ColorManagement.workingColorSpace !== LinearSRGBColorSpace && "COLOR_0" in attributes) {
    console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ColorManagement.workingColorSpace}" not supported.`);
  }
  assignExtrasToUserData(geometry, primitiveDef);
  computeBounds(geometry, primitiveDef, parser);
  return Promise.all(pending).then(function() {
    return primitiveDef.targets !== void 0 ? addMorphTargets(geometry, primitiveDef.targets, parser) : geometry;
  });
}
const _hoisted_1$1 = {
  key: 0,
  class: "model-status"
};
const _hoisted_2$1 = {
  key: 1,
  class: "model-status warning"
};
const _hoisted_3$1 = {
  key: 2,
  class: "model-status warning"
};
const _hoisted_4$1 = {
  key: 3,
  class: "render-error"
};
const SURFACE_LINE_OFFSET = 0.012;
const ACUPOINT_SURFACE_OFFSET = 15e-4;
const ACUPOINT_MARKER_HEIGHT = 0.02;
const LABEL_SURFACE_OFFSET = 0.02;
const MAX_SURFACE_SAMPLE_STEP = 0.32;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HumanMeridian3D",
  props: {
    showSkin: { type: Boolean },
    showMuscles: { type: Boolean },
    showSkeleton: { type: Boolean },
    showOrgans: { type: Boolean },
    showMeridians: { type: Boolean },
    flowSpeed: {},
    selectedId: { default: null }
  },
  emits: ["select"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const container = ref(null);
    const renderError = ref(false);
    const isModelLoading = ref(true);
    const modelLoadError = ref(false);
    const surfaceFitError = ref(false);
    let scene;
    let camera;
    let renderer;
    let controls;
    let resizeObserver;
    let animationFrame = 0;
    let lastRenderedAt = 0;
    let needsRender = true;
    let skinGroup;
    let muscleGroup;
    let skeletonGroup;
    let organGroup;
    let meridianGroup;
    let projectionSurface;
    let renderedMeridianId = null;
    let activeFlowGroup;
    let activeFlowMeridianId = null;
    let bronzeHuman;
    let selectedObject = null;
    const raycaster = new Raycaster();
    const surfaceProjectionRaycaster = new Raycaster();
    const visibilityRaycaster = new Raycaster();
    const pointer = new Vector2();
    const interactiveObjects = [];
    const flowingParticles = [];
    const meridianLines = [];
    const meridianCurves = /* @__PURE__ */ new Map();
    const curveSurfaceSamples = /* @__PURE__ */ new WeakMap();
    const meridianCurvePaths = [];
    const meridianLabels = /* @__PURE__ */ new Map();
    const acupointLabels = /* @__PURE__ */ new Map();
    const acupointMarkers = [];
    const surfaceVisibilityCache = /* @__PURE__ */ new WeakMap();
    let renderedLabelMeridianId = null;
    const SURFACE_NORMAL_AXIS = new Vector3(0, 1, 0);
    const meridians = [
      { id: "ren", name: "任脉", color: 16765286, paths: [[[0, -0.72, 0.62], [0, -0.4, 0.88], [0, 0.7, 0.92], [0, 1.8, 0.83], [0, 2.55, 0.56], [0, 3, 0.51]]] },
      { id: "du", name: "督脉", color: 16739179, paths: [[[0, -0.82, -0.66], [0, -0.1, -0.82], [0, 1.2, -0.84], [0, 2.3, -0.55], [0, 3.55, -0.15], [0, 3.02, 0.48]]] },
      { id: "lung", name: "手太阴肺经", color: 15332863, paths: [[[-0.34, 1.82, 0.82], [-0.68, 1.62, 0.69], [-1, 1.28, 0.55], [-1.27, 0.82, 0.42], [-1.48, 0.3, 0.32]], [[0.34, 1.82, 0.82], [0.68, 1.62, 0.69], [1, 1.28, 0.55], [1.27, 0.82, 0.42], [1.48, 0.3, 0.32]]] },
      { id: "large-intestine", name: "手阳明大肠经", color: 16032353, paths: [[[-1.5, 0.3, 0.18], [-1.28, 0.82, 0.14], [-1.02, 1.3, 0.2], [-0.68, 1.78, 0.38], [-0.26, 2.82, 0.49]], [[1.5, 0.3, 0.18], [1.28, 0.82, 0.14], [1.02, 1.3, 0.2], [0.68, 1.78, 0.38], [0.26, 2.82, 0.49]]] },
      { id: "stomach", name: "足阳明胃经", color: 16762967, paths: [[[-0.18, 2.88, 0.53], [-0.42, 2.18, 0.68], [-0.5, 1.05, 0.88], [-0.48, -0.25, 0.74], [-0.52, -1.45, 0.47], [-0.55, -2.75, 0.35], [-0.48, -3.85, 0.25]], [[0.18, 2.88, 0.53], [0.42, 2.18, 0.68], [0.5, 1.05, 0.88], [0.48, -0.25, 0.74], [0.52, -1.45, 0.47], [0.55, -2.75, 0.35], [0.48, -3.85, 0.25]]] },
      { id: "spleen", name: "足太阴脾经", color: 16752412, paths: [[[-0.6, -3.84, 0.1], [-0.42, -2.8, 0.12], [-0.32, -1.5, 0.25], [-0.28, -0.28, 0.69], [-0.65, 0.72, 0.75], [-0.8, 1.38, 0.55]], [[0.6, -3.84, 0.1], [0.42, -2.8, 0.12], [0.32, -1.5, 0.25], [0.28, -0.28, 0.69], [0.65, 0.72, 0.75], [0.8, 1.38, 0.55]]] },
      { id: "heart", name: "手少阴心经", color: 16731501, paths: [[[-0.22, 1.48, 0.78], [-0.7, 1.36, 0.55], [-1, 1, 0.4], [-1.28, 0.62, 0.28], [-1.5, 0.27, 0.2]], [[0.22, 1.48, 0.78], [0.7, 1.36, 0.55], [1, 1, 0.4], [1.28, 0.62, 0.28], [1.5, 0.27, 0.2]]] },
      { id: "small-intestine", name: "手太阳小肠经", color: 16744273, paths: [[[-1.52, 0.28, -0.02], [-1.3, 0.78, -0.22], [-1.02, 1.3, -0.38], [-0.68, 1.78, -0.55], [-0.46, 3.05, 0.08]], [[1.52, 0.28, -0.02], [1.3, 0.78, -0.22], [1.02, 1.3, -0.38], [0.68, 1.78, -0.55], [0.46, 3.05, 0.08]]] },
      { id: "bladder", name: "足太阳膀胱经", color: 5032432, paths: [[[-0.22, 3.05, 0.42], [-0.24, 2.7, -0.48], [-0.3, 1.45, -0.83], [-0.34, 0.1, -0.78], [-0.45, -1.55, -0.48], [-0.48, -2.85, -0.38], [-0.62, -3.82, -0.18]], [[0.22, 3.05, 0.42], [0.24, 2.7, -0.48], [0.3, 1.45, -0.83], [0.34, 0.1, -0.78], [0.45, -1.55, -0.48], [0.48, -2.85, -0.38], [0.62, -3.82, -0.18]]] },
      { id: "kidney", name: "足少阴肾经", color: 4415982, paths: [[[-0.3, -3.9, 0.03], [-0.28, -2.8, 0.22], [-0.22, -1.45, 0.34], [-0.16, -0.2, 0.65], [-0.22, 1.25, 0.78]], [[0.3, -3.9, 0.03], [0.28, -2.8, 0.22], [0.22, -1.45, 0.34], [0.16, -0.2, 0.65], [0.22, 1.25, 0.78]]] },
      { id: "pericardium", name: "手厥阴心包经", color: 16196997, paths: [[[-0.12, 1.25, 0.9], [-0.62, 1.42, 0.61], [-1.02, 1.02, 0.46], [-1.43, 0.34, 0.34]], [[0.12, 1.25, 0.9], [0.62, 1.42, 0.61], [1.02, 1.02, 0.46], [1.43, 0.34, 0.34]]] },
      { id: "triple-burner", name: "手少阳三焦经", color: 11868062, paths: [[[-1.5, 0.3, -0.05], [-1.3, 0.82, -0.25], [-1, 1.32, -0.38], [-0.62, 1.78, -0.32], [-0.46, 2.86, 0.28]], [[1.5, 0.3, -0.05], [1.3, 0.82, -0.25], [1, 1.32, -0.38], [0.62, 1.78, -0.32], [0.46, 2.86, 0.28]]] },
      { id: "gallbladder", name: "足少阳胆经", color: 8435992, paths: [[[-0.42, 3.06, 0.18], [-0.62, 2.25, 0.05], [-0.88, 1.08, 0.2], [-0.78, -0.15, 0.1], [-0.7, -1.52, 0.02], [-0.72, -2.78, 0.02], [-0.72, -3.82, 0.08]], [[0.42, 3.06, 0.18], [0.62, 2.25, 0.05], [0.88, 1.08, 0.2], [0.78, -0.15, 0.1], [0.7, -1.52, 0.02], [0.72, -2.78, 0.02], [0.72, -3.82, 0.08]]] },
      { id: "liver", name: "足厥阴肝经", color: 5613104, paths: [[[-0.48, -3.85, 0.22], [-0.28, -2.72, 0.28], [-0.18, -1.48, 0.4], [-0.12, -0.28, 0.72], [-0.48, 0.88, 0.82]], [[0.48, -3.85, 0.22], [0.28, -2.72, 0.28], [0.18, -1.48, 0.4], [0.12, -0.28, 0.72], [0.48, 0.88, 0.82]]] }
    ];
    const meridianAcupoints = {
      lung: ["中府", "尺泽", "列缺", "太渊", "少商"],
      "large-intestine": ["商阳", "合谷", "曲池", "肩髃", "迎香"],
      stomach: ["承泣", "颊车", "天枢", "足三里", "丰隆", "内庭"],
      spleen: ["隐白", "太白", "三阴交", "阴陵泉", "血海"],
      heart: ["极泉", "少海", "通里", "神门", "少冲"],
      "small-intestine": ["少泽", "后溪", "养老", "天宗", "听宫"],
      bladder: ["睛明", "肺俞", "肾俞", "委中", "昆仑", "至阴"],
      kidney: ["涌泉", "太溪", "照海", "复溜", "俞府"],
      pericardium: ["天池", "曲泽", "内关", "大陵", "劳宫", "中冲"],
      "triple-burner": ["关冲", "阳池", "外关", "支沟", "翳风", "丝竹空"],
      gallbladder: ["瞳子髎", "风池", "肩井", "环跳", "阳陵泉", "足临泣"],
      liver: ["大敦", "行间", "太冲", "曲泉", "期门"],
      ren: ["中极", "关元", "气海", "神阙", "膻中", "承浆"],
      du: ["长强", "命门", "大椎", "百会", "水沟"]
    };
    function material(color, opacity = 1) {
      return new MeshStandardMaterial({ color, transparent: opacity < 1, opacity, roughness: 0.58, metalness: 0.04, depthWrite: opacity > 0.45 });
    }
    function ellipsoid(parent, name, position, scale, color, opacity = 1) {
      const mesh = new Mesh(new SphereGeometry(1, 28, 20), material(color, opacity));
      mesh.name = name;
      mesh.position.set(...position);
      mesh.scale.set(...scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }
    function capsule(parent, name, position, radius, length, color, rotationZ = 0, opacity = 1) {
      const mesh = new Mesh(new CapsuleGeometry(radius, length, 10, 20), material(color, opacity));
      mesh.name = name;
      mesh.position.set(...position);
      mesh.rotation.z = rotationZ;
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }
    function cylinderBetween(parent, start, end, radius, color) {
      const a = new Vector3(...start);
      const b = new Vector3(...end);
      const direction = b.clone().sub(a);
      const mesh = new Mesh(new CylinderGeometry(radius, radius, direction.length(), 12), material(color));
      mesh.position.copy(a.clone().add(b).multiplyScalar(0.5));
      mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize());
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }
    function markInteractive(object, selection) {
      object.userData.selection = selection;
      interactiveObjects.push(object);
    }
    function createSkin() {
      const group = new Group();
      group.name = "皮肤轮廓";
      ellipsoid(group, "头部皮肤", [0, 3.05, 0], [0.5, 0.64, 0.46], 15841946, 0.28);
      capsule(group, "颈部皮肤", [0, 2.36, 0], 0.27, 0.32, 15248008, 0, 0.28);
      ellipsoid(group, "躯干皮肤", [0, 0.95, 0], [0.92, 1.48, 0.65], 15248008, 0.25);
      ellipsoid(group, "骨盆皮肤", [0, -0.56, 0], [0.76, 0.68, 0.58], 15248008, 0.25);
      capsule(group, "左臂皮肤", [-1.12, 1.05, 0], 0.25, 1.38, 15248008, -0.22, 0.28);
      capsule(group, "右臂皮肤", [1.12, 1.05, 0], 0.25, 1.38, 15248008, 0.22, 0.28);
      capsule(group, "左前臂皮肤", [-1.48, -0.25, 0], 0.2, 1.15, 15248008, -0.12, 0.28);
      capsule(group, "右前臂皮肤", [1.48, -0.25, 0], 0.2, 1.15, 15248008, 0.12, 0.28);
      capsule(group, "左大腿皮肤", [-0.42, -1.7, 0], 0.36, 1.65, 15248008, -0.04, 0.28);
      capsule(group, "右大腿皮肤", [0.42, -1.7, 0], 0.36, 1.65, 15248008, 0.04, 0.28);
      capsule(group, "左小腿皮肤", [-0.47, -3.25, 0], 0.25, 1.28, 15248008, 0.02, 0.28);
      capsule(group, "右小腿皮肤", [0.47, -3.25, 0], 0.25, 1.28, 15248008, -0.02, 0.28);
      ellipsoid(group, "左足皮肤", [-0.47, -4.03, 0.18], [0.28, 0.18, 0.52], 15248008, 0.28);
      ellipsoid(group, "右足皮肤", [0.47, -4.03, 0.18], [0.28, 0.18, 0.52], 15248008, 0.28);
      return group;
    }
    function updateBronzeMaterial() {
      if (!bronzeHuman) return;
      const showInternalLayers = props.showOrgans || props.showSkeleton || props.showMuscles;
      const opacity = showInternalLayers ? 0.2 : 1;
      bronzeHuman.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((item) => {
          item.transparent = opacity < 1;
          item.opacity = opacity;
          item.depthWrite = opacity > 0.5;
          item.needsUpdate = true;
        });
      });
    }
    function applyMaleBodyMorphs(model) {
      const morphWeights = {
        bodyMasculine: 1,
        bodyMuscular: 0.18,
        bustSmaller: 0.9,
        shouldersWider: 0.24,
        chestWider: 0.1,
        chestVShape: 0.18,
        chestPectorals: 0.18,
        hipsNarrower: 0.2,
        jawWider: 0.12,
        neckThicker: 0.08,
        armsMuscular: 0.12,
        thighsMuscular: 0.1,
        calvesMuscular: 0.1
      };
      model.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        const dictionary = object.morphTargetDictionary;
        const influences = object.morphTargetInfluences;
        if (!dictionary || !influences) return;
        Object.entries(morphWeights).forEach(([name, weight]) => {
          const index = dictionary[name];
          if (index !== void 0) influences[index] = weight;
        });
      });
    }
    function updateSkinnedMeshSkeletons(model) {
      model.updateMatrixWorld(true);
      model.traverse((object) => {
        if (object instanceof SkinnedMesh) object.skeleton.update();
      });
    }
    function loadBronzeHuman(target) {
      const modelUrl = new URL("./models/acupuncture-bronze-human.glb", window.location.href).href;
      new GLTFLoader().load(modelUrl, (gltf) => {
        const model = gltf.scene;
        applyMaleBodyMorphs(model);
        const leftArm = model.getObjectByName("mixamorig:LeftArm") ?? model.getObjectByName("mixamorigLeftArm");
        const rightArm = model.getObjectByName("mixamorig:RightArm") ?? model.getObjectByName("mixamorigRightArm");
        if (leftArm && rightArm) {
          leftArm.rotation.z -= 0.4;
          rightArm.rotation.z += 0.4;
        }
        updateSkinnedMeshSkeletons(model);
        const initialBounds = new Box3().setFromObject(model);
        const initialSize = initialBounds.getSize(new Vector3());
        const scale = initialSize.y > 0 ? 8.05 / initialSize.y : 1;
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);
        const bounds = new Box3().setFromObject(model);
        const center = bounds.getCenter(new Vector3());
        model.position.set(-center.x, -0.25 - center.y, -center.z);
        updateSkinnedMeshSkeletons(model);
        model.name = "仿真针灸经络铜人";
        const bronzeMaterial = new MeshPhysicalMaterial({
          color: 12352056,
          emissive: 2363396,
          emissiveIntensity: 0.18,
          metalness: 0.54,
          roughness: 0.38,
          clearcoat: 0.3,
          clearcoatRoughness: 0.42,
          envMapIntensity: 1.25
        });
        model.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          object.material = bronzeMaterial;
          object.castShadow = true;
          object.receiveShadow = true;
        });
        disposeObject(target);
        target.clear();
        target.add(model);
        bronzeHuman = model;
        target.updateMatrixWorld(true);
        try {
          rebuildSurfaceMeridians(props.selectedId ?? null);
        } catch (error) {
          surfaceFitError.value = true;
          console.error("[HumanMeridian3D] 经络贴肤计算失败，已保留基础经络", error);
        } finally {
          isModelLoading.value = false;
        }
        updateBronzeMaterial();
      }, void 0, (error) => {
        isModelLoading.value = false;
        modelLoadError.value = true;
        if (scene && meridianGroup && meridianGroup.children.length === 0) {
          scene.remove(meridianGroup);
          meridianCurvePaths.length = 0;
          meridianCurves.clear();
          const meridianId = meridians.some((item) => item.id === props.selectedId) ? props.selectedId : null;
          meridianGroup = meridianId ? createMeridians(void 0, meridianId) : new Group();
          renderedMeridianId = meridianId;
          meridianGroup.visible = props.showMeridians;
          scene.add(meridianGroup);
          createMeridianLabels(props.selectedId ?? null);
          syncActiveFlowParticles(props.selectedId ?? null);
          highlightSelection(props.selectedId ?? null);
        }
        console.error("[HumanMeridian3D] 铜人人体模型加载失败，已使用简化模型", error);
      });
    }
    function createMuscles() {
      const group = new Group();
      const red = 10369842;
      ellipsoid(group, "胸大肌", [0, 1.45, 0.34], [0.72, 0.58, 0.28], red, 0.72);
      ellipsoid(group, "腹直肌", [0, 0.22, 0.38], [0.42, 0.86, 0.22], 12013378, 0.74);
      capsule(group, "左上肢肌群", [-1.12, 0.78, 0], 0.19, 1.42, red, -0.22, 0.76);
      capsule(group, "右上肢肌群", [1.12, 0.78, 0], 0.19, 1.42, red, 0.22, 0.76);
      capsule(group, "左股四头肌", [-0.42, -1.78, 0.18], 0.27, 1.58, red, -0.04, 0.76);
      capsule(group, "右股四头肌", [0.42, -1.78, 0.18], 0.27, 1.58, red, 0.04, 0.76);
      capsule(group, "左小腿肌群", [-0.47, -3.22, -0.05], 0.18, 1.2, 9252908, 0.02, 0.76);
      capsule(group, "右小腿肌群", [0.47, -3.22, -0.05], 0.18, 1.2, 9252908, -0.02, 0.76);
      return group;
    }
    function createSkeleton() {
      const group = new Group();
      const bone = 15657173;
      const skull = ellipsoid(group, "颅骨", [0, 3.08, 0], [0.43, 0.55, 0.4], bone);
      markInteractive(skull, { id: "skull", name: "颅骨", kind: "skeleton" });
      cylinderBetween(group, [0, 2.55, 0], [0, -0.75, 0], 0.09, bone).name = "脊柱";
      for (let i = 0; i < 11; i += 1) {
        const y = 2.18 - i * 0.27;
        const width = 0.72 - Math.abs(i - 5) * 0.035;
        const curve = new CatmullRomCurve3([
          new Vector3(0, y, -0.08),
          new Vector3(-width, y, 0),
          new Vector3(0, y - 0.1, 0.44)
        ]);
        const left = new Mesh(new TubeGeometry(curve, 16, 0.035, 8, false), material(bone));
        const right = left.clone();
        right.scale.x = -1;
        group.add(left, right);
      }
      cylinderBetween(group, [-0.72, 2.05, 0], [0.72, 2.05, 0], 0.055, bone).name = "锁骨";
      cylinderBetween(group, [-0.72, 1.95, 0], [-1.5, -0.62, 0], 0.055, bone).name = "左臂骨";
      cylinderBetween(group, [0.72, 1.95, 0], [1.5, -0.62, 0], 0.055, bone).name = "右臂骨";
      cylinderBetween(group, [-0.34, -0.55, 0], [-0.48, -3.92, 0], 0.075, bone).name = "左腿骨";
      cylinderBetween(group, [0.34, -0.55, 0], [0.48, -3.92, 0], 0.075, bone).name = "右腿骨";
      const pelvis = new Mesh(new TorusGeometry(0.56, 0.11, 10, 32), material(bone));
      pelvis.name = "骨盆";
      pelvis.position.y = -0.62;
      pelvis.rotation.x = Math.PI / 2;
      group.add(pelvis);
      group.traverse((object) => {
        if (object instanceof Mesh && !object.userData.selection) {
          markInteractive(object, { id: object.name || "skeleton", name: object.name || "骨骼", kind: "skeleton" });
        }
      });
      return group;
    }
    function organ(parent, id, name, position, scale, color) {
      const mesh = ellipsoid(parent, name, position, scale, color, 0.92);
      markInteractive(mesh, { id, name, kind: "organ" });
    }
    function createOrgans() {
      const group = new Group();
      organ(group, "brain", "脑", [0, 3.1, 0.02], [0.36, 0.42, 0.34], 15178417);
      organ(group, "left-lung", "左肺", [-0.3, 1.45, 0.12], [0.28, 0.62, 0.3], 14258063);
      organ(group, "right-lung", "右肺", [0.3, 1.45, 0.12], [0.28, 0.62, 0.3], 14258063);
      organ(group, "heart", "心脏", [0.08, 1.25, 0.46], [0.22, 0.32, 0.2], 13184058);
      organ(group, "liver", "肝脏", [0.34, 0.62, 0.25], [0.5, 0.28, 0.28], 9386802);
      organ(group, "stomach", "胃", [-0.28, 0.45, 0.3], [0.28, 0.38, 0.23], 13926250);
      organ(group, "spleen", "脾脏", [-0.55, 0.55, 0.08], [0.14, 0.27, 0.12], 8005960);
      organ(group, "left-kidney", "左肾", [-0.36, 0.05, -0.22], [0.16, 0.27, 0.13], 9125709);
      organ(group, "right-kidney", "右肾", [0.36, 0.05, -0.22], [0.16, 0.27, 0.13], 9125709);
      const intestineCurve = new CatmullRomCurve3([
        new Vector3(-0.42, 0.05, 0.3),
        new Vector3(0.38, 0.02, 0.3),
        new Vector3(0.4, -0.45, 0.32),
        new Vector3(-0.38, -0.42, 0.32),
        new Vector3(-0.3, -0.08, 0.34),
        new Vector3(0.26, -0.12, 0.34)
      ]);
      const intestine = new Mesh(new TubeGeometry(intestineCurve, 50, 0.09, 12, false), material(13206123));
      intestine.name = "肠道";
      group.add(intestine);
      markInteractive(intestine, { id: "intestines", name: "肠道", kind: "organ" });
      return group;
    }
    function findDirectionalSurfaceProjection(point, surface, outwardDirection) {
      const vertexSets = surface.userData.projectionVertexSets;
      if (!vertexSets?.length) return null;
      const bestPoint = new Vector3();
      const bestNormal = outwardDirection.clone();
      const projectsFrontBack = Math.abs(outwardDirection.z) > 0.5;
      let bestSliceDistanceSq = Number.POSITIVE_INFINITY;
      vertexSets.forEach(({ positions, normals }) => {
        for (let index = 0; index < positions.length; index += 3) {
          const deltaY = positions[index + 1] - point.y;
          const lateralDelta = projectsFrontBack ? positions[index] - point.x : positions[index + 2] - point.z;
          const sliceDistanceSq = lateralDelta * lateralDelta + deltaY * deltaY;
          if (sliceDistanceSq < bestSliceDistanceSq) bestSliceDistanceSq = sliceDistanceSq;
        }
      });
      if (!Number.isFinite(bestSliceDistanceSq)) return null;
      const sliceToleranceSq = bestSliceDistanceSq + 8e-3;
      let bestOutwardDistance = Number.NEGATIVE_INFINITY;
      vertexSets.forEach(({ positions, normals }) => {
        for (let index = 0; index < positions.length; index += 3) {
          const deltaY = positions[index + 1] - point.y;
          const lateralDelta = projectsFrontBack ? positions[index] - point.x : positions[index + 2] - point.z;
          if (lateralDelta * lateralDelta + deltaY * deltaY > sliceToleranceSq) continue;
          const outwardDistance = projectsFrontBack ? positions[index + 2] * outwardDirection.z : positions[index] * outwardDirection.x;
          if (outwardDistance <= bestOutwardDistance) continue;
          bestOutwardDistance = outwardDistance;
          bestPoint.set(positions[index], positions[index + 1], positions[index + 2]);
          bestNormal.set(normals[index], normals[index + 1], normals[index + 2]);
        }
      });
      if (!Number.isFinite(bestOutwardDistance)) return null;
      if (bestNormal.dot(outwardDirection) < 0) bestNormal.negate();
      return { point: bestPoint, normal: bestNormal.normalize(), isValid: true };
    }
    function findRaycastSurfaceProjection(point, surface, outwardDirection) {
      let targets = surface.userData.meridianProjectionTargets;
      if (!targets) {
        const bodyTargets = [];
        const meshTargets = [];
        surface.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          meshTargets.push(object);
          if (object.name.toLowerCase().includes("body")) bodyTargets.push(object);
        });
        targets = bodyTargets.length > 0 ? bodyTargets : meshTargets;
        surface.userData.meridianProjectionTargets = targets;
      }
      const projectsFrontBack = Math.abs(outwardDirection.z) > 0.5;
      const lateralOffsets = [0];
      const verticalOffsets = [0];
      const rayOrigin = new Vector3();
      const rayDirection = outwardDirection.clone().negate();
      for (const verticalOffset of verticalOffsets) {
        for (const lateralOffset of lateralOffsets) {
          if (projectsFrontBack) {
            rayOrigin.set(point.x + lateralOffset, point.y + verticalOffset, outwardDirection.z * 6);
          } else {
            rayOrigin.set(outwardDirection.x * 6, point.y + verticalOffset, point.z + lateralOffset);
          }
          surfaceProjectionRaycaster.set(rayOrigin, rayDirection);
          surfaceProjectionRaycaster.near = 0;
          surfaceProjectionRaycaster.far = 12;
          const hit = surfaceProjectionRaycaster.intersectObjects(targets, false)[0];
          if (!hit) continue;
          return {
            point: hit.point.clone(),
            normal: outwardDirection.clone(),
            isValid: true
          };
        }
      }
      return null;
    }
    function projectPointToSurface(point, surface, projectsFrontBack = Math.abs(point.z) >= Math.abs(point.x)) {
      const outwardDirection = projectsFrontBack ? new Vector3(0, 0, point.z < 0 ? -1 : 1) : new Vector3(point.x < 0 ? -1 : 1, 0, 0);
      const staticSurface = surface.userData.projectionVertexSets ? surface : projectionSurface;
      return findRaycastSurfaceProjection(point, staticSurface ?? surface, outwardDirection) ?? (staticSurface ? findDirectionalSurfaceProjection(point, staticSurface, outwardDirection) : null) ?? {
        point: point.clone(),
        normal: outwardDirection,
        isValid: false
      };
    }
    function createMeridianCurve(path, surface) {
      const sourceCurve = new CatmullRomCurve3(
        path.map((point) => new Vector3(...point)),
        false,
        "catmullrom",
        0.35
      );
      if (!surface) return sourceCurve;
      const sampleCount = Math.max(28, path.length * 5);
      const projectedPoints = [];
      const surfaceSamples = [];
      for (let index = 0; index < sampleCount; index += 1) {
        const sourcePoint = sourceCurve.getPoint(index / (sampleCount - 1));
        const projection = projectPointToSurface(sourcePoint, surface, true);
        const surfacePoint = projection.point.addScaledVector(projection.normal, SURFACE_LINE_OFFSET);
        projectedPoints.push(surfacePoint);
        surfaceSamples.push({ point: surfacePoint.clone(), normal: projection.normal.clone(), isValid: projection.isValid });
      }
      const surfacePath = new CurvePath();
      for (let index = 1; index < projectedPoints.length; index += 1) {
        if (surfaceSamples[index - 1].isValid === false || surfaceSamples[index].isValid === false) continue;
        if (projectedPoints[index - 1].distanceTo(projectedPoints[index]) > MAX_SURFACE_SAMPLE_STEP) continue;
        surfacePath.add(new LineCurve3(projectedPoints[index - 1], projectedPoints[index]));
      }
      curveSurfaceSamples.set(surfacePath, surfaceSamples);
      return surfacePath;
    }
    function isMirroredPath(source, candidate) {
      return source.length === candidate.length && source.every((point, index) => Math.abs(point[0] + candidate[index][0]) < 1e-4 && Math.abs(point[1] - candidate[index][1]) < 1e-4 && Math.abs(point[2] - candidate[index][2]) < 1e-4);
    }
    function createMirroredSurfaceCurve(sourceCurve) {
      const sourceSamples = curveSurfaceSamples.get(sourceCurve) ?? [];
      const mirroredSamples = sourceSamples.map(({ point, normal, isValid }) => ({
        point: new Vector3(-point.x, point.y, point.z),
        normal: new Vector3(-normal.x, normal.y, normal.z),
        isValid
      }));
      const mirroredPath = new CurvePath();
      for (let index = 1; index < mirroredSamples.length; index += 1) {
        if (mirroredSamples[index - 1].isValid === false || mirroredSamples[index].isValid === false) continue;
        if (mirroredSamples[index - 1].point.distanceTo(mirroredSamples[index].point) > MAX_SURFACE_SAMPLE_STEP) continue;
        mirroredPath.add(new LineCurve3(mirroredSamples[index - 1].point, mirroredSamples[index].point));
      }
      curveSurfaceSamples.set(mirroredPath, mirroredSamples);
      return mirroredPath;
    }
    function getCurveSurfaceProjection(curve, progress) {
      const samples = curveSurfaceSamples.get(curve);
      if (samples?.length) {
        const sample = samples[Math.min(samples.length - 1, Math.round(progress * (samples.length - 1)))];
        return { point: sample.point.clone(), normal: sample.normal.clone(), isValid: sample.isValid };
      }
      const point = curve.getPointAt(progress);
      const normal = new Vector3(point.x, 0, point.z);
      if (normal.lengthSq() < 1e-4) normal.set(0, 0, 1);
      return { point, normal: normal.normalize() };
    }
    function createStaticProjectionSurface(source) {
      const surface = new Group();
      const projectionVertexSets = [];
      source.updateMatrixWorld(true);
      const sourceMeshes = [];
      source.traverse((object) => {
        if (object instanceof Mesh) sourceMeshes.push(object);
      });
      const geometryMeshes = sourceMeshes.filter((object) => {
        const position = object.geometry.getAttribute("position");
        return Boolean(position && position.itemSize >= 3 && position.count > 0);
      });
      const bodyMeshes = geometryMeshes.filter((object) => object.name.toLowerCase().includes("body"));
      const projectionMeshes = bodyMeshes.length > 0 ? bodyMeshes : geometryMeshes;
      projectionMeshes.forEach((object) => {
        if (!(object instanceof Mesh)) return;
        const sourcePosition = object.geometry.getAttribute("position");
        if (!sourcePosition || sourcePosition.itemSize < 3 || sourcePosition.count === 0) return;
        const geometry = object.geometry.clone();
        const targetPosition = new Float32BufferAttribute(new Float32Array(sourcePosition.count * 3), 3);
        geometry.setAttribute("position", targetPosition);
        geometry.morphAttributes = {};
        const vertex = new Vector3();
        for (let index = 0; index < sourcePosition.count; index += 1) {
          object.getVertexPosition(index, vertex);
          if (!Number.isFinite(vertex.x) || !Number.isFinite(vertex.y) || !Number.isFinite(vertex.z)) {
            vertex.set(sourcePosition.getX(index), sourcePosition.getY(index), sourcePosition.getZ(index));
          }
          vertex.applyMatrix4(object.matrixWorld);
          if (!Number.isFinite(vertex.x) || !Number.isFinite(vertex.y) || !Number.isFinite(vertex.z)) continue;
          targetPosition.setXYZ(index, vertex.x, vertex.y, vertex.z);
        }
        targetPosition.needsUpdate = true;
        geometry.deleteAttribute("normal");
        geometry.computeVertexNormals();
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        const targetNormal = geometry.getAttribute("normal");
        if (targetNormal && !targetNormal.isInterleavedBufferAttribute) {
          projectionVertexSets.push({
            positions: targetPosition.array,
            normals: targetNormal.array
          });
        }
        surface.add(new Mesh(geometry, new MeshBasicMaterial({ side: DoubleSide })));
      });
      surface.userData.projectionVertexSets = projectionVertexSets;
      surface.updateMatrixWorld(true);
      return surface;
    }
    function createMeridians(surface, onlyMeridianId) {
      const group = new Group();
      meridians.filter((definition) => !onlyMeridianId || definition.id === onlyMeridianId).forEach((definition) => {
        let primaryCurve;
        definition.paths.forEach((path, pathIndex) => {
          const curve = primaryCurve && curveSurfaceSamples.has(primaryCurve) && isMirroredPath(definition.paths[0], path) ? createMirroredSurfaceCurve(primaryCurve) : createMeridianCurve(path, surface);
          if (pathIndex === 0) {
            primaryCurve = curve;
            meridianCurves.set(definition.id, curve);
          }
          meridianCurvePaths.push({ curve, meridianId: definition.id });
          const surfaceSamples = curveSurfaceSamples.get(curve);
          const appendLine = (line, anchor, normal) => {
            const lineMaterial = new MeshBasicMaterial({
              color: definition.color,
              transparent: true,
              opacity: 0.74,
              depthTest: true
            });
            line.material = lineMaterial;
            line.renderOrder = 5;
            markInteractive(line, { id: definition.id, name: definition.name, kind: "meridian" });
            group.add(line);
            meridianLines.push({
              mesh: line,
              meridianId: definition.id,
              color: definition.color,
              anchor,
              normal
            });
          };
          if (surfaceSamples?.length) {
            surfaceSamples.slice(1).forEach((end, index) => {
              const start = surfaceSamples[index];
              if (start.isValid === false || end.isValid === false) return;
              const direction = end.point.clone().sub(start.point);
              if (direction.lengthSq() < 1e-6) return;
              if (direction.length() > MAX_SURFACE_SAMPLE_STEP) return;
              const line = new Mesh(
                new CylinderGeometry(0.011, 0.011, direction.length(), 6, 1, false)
              );
              const anchor = start.point.clone().add(end.point).multiplyScalar(0.5);
              line.position.copy(anchor);
              line.quaternion.setFromUnitVectors(SURFACE_NORMAL_AXIS, direction.normalize());
              appendLine(
                line,
                anchor,
                start.normal.clone().add(end.normal).normalize()
              );
            });
          } else {
            const lineSurface = getCurveSurfaceProjection(curve, 0.5);
            appendLine(
              new Mesh(new TubeGeometry(curve, Math.max(36, path.length * 8), 0.011, 6, false)),
              lineSurface.point,
              lineSurface.normal
            );
          }
          const acupoints = meridianAcupoints[definition.id] ?? [];
          acupoints.forEach((name, pointIndex) => {
            const surfaceProjection = getCurveSurfaceProjection(
              curve,
              (pointIndex + 1) / (acupoints.length + 1)
            );
            const marker = new Mesh(
              surface ? new CylinderGeometry(0.038, 0.038, ACUPOINT_MARKER_HEIGHT, 18) : new SphereGeometry(0.024, 8, 6),
              new MeshBasicMaterial({
                color: 10429725,
                transparent: true,
                opacity: 0.82,
                depthTest: true,
                side: DoubleSide,
                polygonOffset: true,
                polygonOffsetFactor: -2,
                polygonOffsetUnits: -2
              })
            );
            marker.name = name;
            marker.position.copy(surfaceProjection.point).addScaledVector(
              surfaceProjection.normal,
              ACUPOINT_SURFACE_OFFSET + ACUPOINT_MARKER_HEIGHT / 2
            );
            marker.quaternion.setFromUnitVectors(SURFACE_NORMAL_AXIS, surfaceProjection.normal);
            marker.renderOrder = 9;
            markInteractive(marker, { id: definition.id, name: definition.name, kind: "meridian" });
            group.add(marker);
            acupointMarkers.push({
              mesh: marker,
              meridianId: definition.id,
              normal: surfaceProjection.normal
            });
          });
        });
      });
      return group;
    }
    function clearActiveFlowParticles() {
      if (activeFlowGroup) {
        activeFlowGroup.parent?.remove(activeFlowGroup);
        disposeObject(activeFlowGroup);
      }
      activeFlowGroup = void 0;
      activeFlowMeridianId = null;
      flowingParticles.length = 0;
    }
    function syncActiveFlowParticles(id) {
      const definition = meridians.find((item) => item.id === id);
      const shouldRender = Boolean(props.showMeridians && meridianGroup && definition);
      if (!shouldRender) {
        clearActiveFlowParticles();
        return;
      }
      if (activeFlowGroup && activeFlowMeridianId === id) return;
      clearActiveFlowParticles();
      const group = new Group();
      const geometry = new SphereGeometry(0.032, 8, 6);
      const particleMaterial = new MeshBasicMaterial({
        color: definition?.color ?? 16768882,
        transparent: true,
        opacity: 0.98,
        depthTest: true
      });
      meridianCurvePaths.filter((item) => item.meridianId === id).forEach(({ curve }, pathIndex) => {
        for (let index = 0; index < 2; index += 1) {
          const particle = new Mesh(geometry, particleMaterial);
          particle.renderOrder = 8;
          group.add(particle);
          flowingParticles.push({
            mesh: particle,
            curve,
            offset: (index / 2 + pathIndex * 0.17) % 1,
            meridianId: id
          });
        }
      });
      activeFlowGroup = group;
      activeFlowMeridianId = id;
      meridianGroup?.add(group);
    }
    function removeMeridianLabels() {
      meridianLabels.forEach(({ element }) => element.remove());
      meridianLabels.clear();
      acupointLabels.forEach(({ element }) => element.remove());
      acupointLabels.clear();
      renderedLabelMeridianId = null;
    }
    function rebuildSurfaceMeridians(id) {
      if (!scene || !bronzeHuman) return;
      selectedObject = null;
      if (meridianGroup) {
        scene.remove(meridianGroup);
        disposeObject(meridianGroup);
      }
      for (let index = interactiveObjects.length - 1; index >= 0; index -= 1) {
        if (interactiveObjects[index].userData.selection?.kind === "meridian") interactiveObjects.splice(index, 1);
      }
      flowingParticles.length = 0;
      meridianLines.length = 0;
      acupointMarkers.length = 0;
      meridianCurves.clear();
      meridianCurvePaths.length = 0;
      activeFlowGroup = void 0;
      activeFlowMeridianId = null;
      removeMeridianLabels();
      projectionSurface ??= createStaticProjectionSurface(bronzeHuman);
      const meridianId = meridians.some((item) => item.id === id) ? id : null;
      meridianGroup = meridianId ? createMeridians(bronzeHuman, meridianId) : new Group();
      renderedMeridianId = meridianId;
      meridianGroup.visible = props.showMeridians;
      scene.add(meridianGroup);
      createMeridianLabels(meridianId);
      syncActiveFlowParticles(meridianId);
      highlightSelection(id);
    }
    function createMeridianLabels(id) {
      if (renderedLabelMeridianId === id) return;
      removeMeridianLabels();
      if (!container.value || !id) return;
      const definition = meridians.find((item) => item.id === id);
      if (!definition) return;
      const mainPath = definition.paths[0];
      const curve = meridianCurves.get(definition.id) ?? createMeridianCurve(mainPath);
      const anchorPoint = createSurfaceLabelAnchor(curve, 0.52);
      const element = document.createElement("button");
      element.type = "button";
      element.className = "meridian-label";
      element.textContent = definition.name;
      element.style.setProperty("--meridian-color", `#${definition.color.toString(16).padStart(6, "0")}`);
      element.title = `点击查看${definition.name}详细介绍`;
      element.addEventListener("pointerdown", (event) => event.stopPropagation());
      element.addEventListener("click", () => {
        emit("select", { id: definition.id, name: definition.name, kind: "meridian" });
      });
      container.value.appendChild(element);
      meridianLabels.set(definition.id, { element, anchor: anchorPoint.point, normal: anchorPoint.normal });
      const acupoints = meridianAcupoints[definition.id] ?? [];
      acupoints.forEach((name, pointIndex) => {
        const pointElement = document.createElement("button");
        pointElement.type = "button";
        pointElement.className = "acupoint-label";
        pointElement.textContent = name;
        pointElement.title = `${definition.name} · ${name}`;
        pointElement.addEventListener("pointerdown", (event) => event.stopPropagation());
        pointElement.addEventListener("click", () => {
          emit("select", { id: definition.id, name: definition.name, kind: "meridian" });
        });
        container.value?.appendChild(pointElement);
        const pointAnchor = createSurfaceLabelAnchor(curve, (pointIndex + 1) / (acupoints.length + 1));
        acupointLabels.set(`${definition.id}-${pointIndex}`, {
          element: pointElement,
          anchor: pointAnchor.point,
          normal: pointAnchor.normal,
          meridianId: definition.id
        });
      });
      renderedLabelMeridianId = id;
    }
    function createSurfaceLabelAnchor(curve, progress) {
      const projection = getCurveSurfaceProjection(curve, progress);
      return {
        point: projection.point.addScaledVector(
          projection.normal,
          bronzeHuman ? LABEL_SURFACE_OFFSET - SURFACE_LINE_OFFSET : LABEL_SURFACE_OFFSET
        ),
        normal: projection.normal
      };
    }
    function updateMeridianLabels() {
      if (!camera || !container.value) return;
      const width = container.value.clientWidth;
      const height = container.value.clientHeight;
      meridianLabels.forEach(({ element, anchor, normal }, id) => {
        const projected = anchor.clone().project(camera);
        const isVisible = props.showMeridians && id === props.selectedId && projected.z > -1 && projected.z < 1 && isSurfacePointVisible(anchor, normal);
        element.style.display = isVisible ? "block" : "none";
        if (!isVisible) return;
        element.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
        element.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
        element.classList.toggle("selected", id === props.selectedId);
      });
      acupointLabels.forEach(({ element, anchor, normal, meridianId }) => {
        const projected = anchor.clone().project(camera);
        const isVisible = props.showMeridians && meridianId === props.selectedId && projected.z > -1 && projected.z < 1 && isSurfacePointVisible(anchor, normal);
        element.style.display = isVisible ? "block" : "none";
        if (!isVisible) return;
        element.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
        element.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
      });
    }
    function isSurfacePointVisible(point, normal) {
      if (!camera) return true;
      const cached = surfaceVisibilityCache.get(point);
      if (cached?.cameraPosition.distanceToSquared(camera.position) < 1e-6) return cached.visible;
      const directionToCamera = camera.position.clone().sub(point);
      const distanceToCamera = directionToCamera.length();
      const isFacingCamera = normal.dot(directionToCamera.normalize()) > -0.1;
      let visible = isFacingCamera;
      const occlusionSurface = projectionSurface ?? bronzeHuman;
      if (visible && occlusionSurface && distanceToCamera > 0.05) {
        visibilityRaycaster.near = 0.01;
        visibilityRaycaster.far = Math.max(0.01, distanceToCamera - 0.035);
        visibilityRaycaster.set(camera.position, point.clone().sub(camera.position).normalize());
        visible = visibilityRaycaster.intersectObject(occlusionSurface, true).length === 0;
      }
      surfaceVisibilityCache.set(point, { cameraPosition: camera.position.clone(), visible });
      return visible;
    }
    function isSurfaceNormalFacingCamera(point, normal) {
      if (!camera) return true;
      return normal.dot(camera.position.clone().sub(point).normalize()) > -0.1;
    }
    function removeInteractiveObjects(root) {
      const descendants = /* @__PURE__ */ new Set();
      root.traverse((object) => descendants.add(object));
      if (selectedObject && descendants.has(selectedObject)) selectedObject = null;
      for (let index = interactiveObjects.length - 1; index >= 0; index -= 1) {
        if (descendants.has(interactiveObjects[index])) interactiveObjects.splice(index, 1);
      }
    }
    function releaseAnatomyLayer(layer) {
      const group = layer === "muscles" ? muscleGroup : layer === "skeleton" ? skeletonGroup : organGroup;
      if (!group) return;
      removeInteractiveObjects(group);
      group.parent?.remove(group);
      disposeObject(group);
      if (layer === "muscles") muscleGroup = void 0;
      else if (layer === "skeleton") skeletonGroup = void 0;
      else organGroup = void 0;
    }
    function syncAnatomyLayer(layer, shouldShow) {
      if (!scene) return;
      const current = layer === "muscles" ? muscleGroup : layer === "skeleton" ? skeletonGroup : organGroup;
      if (!shouldShow) {
        if (current) releaseAnatomyLayer(layer);
        return;
      }
      if (current) return;
      const group = layer === "muscles" ? createMuscles() : layer === "skeleton" ? createSkeleton() : createOrgans();
      if (layer === "muscles") muscleGroup = group;
      else if (layer === "skeleton") skeletonGroup = group;
      else organGroup = group;
      scene.add(group);
    }
    function createScene() {
      if (!container.value) return;
      try {
        scene = new Scene();
        scene.background = new Color(463631);
        scene.fog = new FogExp2(463631, 0.035);
        camera = new PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 0.2, 11.5);
        renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.shadowMap.enabled = false;
        container.value.appendChild(renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = 6;
        controls.maxDistance = 18;
        controls.target.set(0, -0.25, 0);
        controls.addEventListener("change", requestRender);
        scene.add(new HemisphereLight(16771792, 1780517, 2.15));
        const key = new DirectionalLight(16769461, 3.1);
        key.position.set(4, 7, 8);
        scene.add(key);
        const rim = new DirectionalLight(5898178, 1.7);
        rim.position.set(-5, 2, -6);
        scene.add(rim);
        const floor = new Mesh(
          new CircleGeometry(5.2, 64),
          new MeshStandardMaterial({ color: 729370, roughness: 0.95, transparent: true, opacity: 0.72 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -4.28;
        floor.receiveShadow = true;
        scene.add(floor);
        const grid = new GridHelper(10, 20, 2513481, 1324331);
        grid.position.y = -4.27;
        scene.add(grid);
        skinGroup = createSkin();
        meridianGroup = new Group();
        scene.add(skinGroup, meridianGroup);
        loadBronzeHuman(skinGroup);
        syncVisibility();
        renderer.domElement.addEventListener("pointerdown", handlePointer);
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container.value);
        resize();
        animate();
      } catch (error) {
        renderError.value = true;
        console.error("[HumanMeridian3D] 初始化失败", error);
      }
    }
    function syncVisibility() {
      if (skinGroup) skinGroup.visible = props.showSkin;
      syncAnatomyLayer("muscles", props.showMuscles);
      syncAnatomyLayer("skeleton", props.showSkeleton);
      syncAnatomyLayer("organs", props.showOrgans);
      if (meridianGroup) meridianGroup.visible = props.showMeridians;
      updateBronzeMaterial();
      syncActiveFlowParticles(props.selectedId ?? null);
      highlightSelection(props.selectedId ?? null);
      requestRender();
    }
    function highlightSelection(id) {
      if (selectedObject instanceof Mesh) {
        const selectedMaterial2 = selectedObject.material;
        if ("emissive" in selectedMaterial2) selectedMaterial2.emissive.setHex(0);
        selectedObject.scale.divideScalar(1.08);
      }
      selectedObject = null;
      const isMeridianSelection = meridians.some((item) => item.id === id);
      createMeridianLabels(isMeridianSelection ? id : null);
      syncActiveFlowParticles(isMeridianSelection ? id : null);
      requestRender();
      acupointMarkers.forEach(({ mesh, meridianId, normal }) => {
        const isSelected = meridianId === id;
        mesh.visible = isSelected && isSurfacePointVisible(mesh.position, normal);
        mesh.scale.setScalar(isSelected ? 1.45 : 0.72);
        const pointMaterial = mesh.material;
        pointMaterial.color.setHex(isSelected ? 16768882 : 10429725);
        pointMaterial.opacity = isSelected ? 1 : 0.68;
      });
      meridianLines.forEach(({ mesh, meridianId, color, anchor, normal }) => {
        const isSelected = meridianId === id;
        mesh.visible = isSelected && isSurfacePointVisible(anchor, normal);
        const lineMaterial = mesh.material;
        lineMaterial.color.setHex(isSelected ? 16769162 : color);
        lineMaterial.opacity = isSelected ? 0.96 : 0.2;
        mesh.scale.setScalar(1);
      });
      if (!id || isMeridianSelection) return;
      const target = interactiveObjects.find((object) => object.userData.selection?.id === id && object.visible);
      if (!(target instanceof Mesh)) return;
      selectedObject = target;
      target.scale.multiplyScalar(1.08);
      const selectedMaterial = target.material;
      if ("emissive" in selectedMaterial) selectedMaterial.emissive.setHex(2641213);
    }
    function handlePointer(event) {
      if (!renderer || !camera) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const visible = interactiveObjects.filter((object) => object.visible && object.parent?.visible !== false);
      const hit = raycaster.intersectObjects(visible, false)[0]?.object;
      const selection = hit?.userData.selection;
      if (selection) emit("select", selection);
    }
    function resize() {
      if (!container.value || !renderer || !camera) return;
      const width = Math.max(1, container.value.clientWidth);
      const height = Math.max(1, container.value.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestRender();
    }
    function requestRender() {
      needsRender = true;
    }
    function animate(now = performance.now()) {
      animationFrame = window.requestAnimationFrame(animate);
      if (now - lastRenderedAt < 33) return;
      const shouldAnimateFlow = props.showMeridians && flowingParticles.length > 0;
      const controlsChanged = controls?.update() ?? false;
      if (!needsRender && !shouldAnimateFlow && !controlsChanged) return;
      lastRenderedAt = now;
      if (shouldAnimateFlow) {
        const time = now * 12e-5 * props.flowSpeed;
        flowingParticles.forEach((particle) => {
          const progress = (time + particle.offset) % 1;
          const projection = getCurveSurfaceProjection(particle.curve, progress);
          particle.mesh.position.copy(projection.point);
          particle.mesh.visible = particle.meridianId === props.selectedId && projection.isValid !== false && isSurfaceNormalFacingCamera(projection.point, projection.normal);
          const pulse = 0.82 + Math.sin((time + particle.offset) * Math.PI * 10) * 0.18;
          particle.mesh.scale.setScalar(pulse);
        });
      }
      acupointMarkers.forEach(({ mesh, meridianId, normal }) => {
        mesh.visible = meridianId === props.selectedId && isSurfacePointVisible(mesh.position, normal);
      });
      meridianLines.forEach(({ mesh, meridianId, anchor, normal }) => {
        mesh.visible = meridianId === props.selectedId && isSurfacePointVisible(anchor, normal);
      });
      updateMeridianLabels();
      if (scene && camera && renderer) renderer.render(scene, camera);
      needsRender = false;
    }
    function setView(view) {
      if (!camera || !controls) return;
      const positions = {
        front: [0, 0.1, 11.5],
        back: [0, 0.1, -11.5],
        left: [-11.5, 0.1, 0],
        right: [11.5, 0.1, 0]
      };
      const position = positions[view];
      camera.position.set(position[0], position[1], position[2]);
      controls.target.set(0, -0.25, 0);
      controls.update();
      requestRender();
    }
    function resetView() {
      if (!camera || !controls) return;
      camera.position.set(0, 0.2, 11.5);
      controls.target.set(0, -0.25, 0);
      controls.reset();
      requestRender();
    }
    function disposeObject(root) {
      root.traverse((object) => {
        if (!(object instanceof Mesh || object instanceof Line)) return;
        object.geometry?.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((item) => item.dispose());
      });
    }
    watch(() => [props.showSkin, props.showMuscles, props.showSkeleton, props.showOrgans, props.showMeridians], syncVisibility);
    watch(() => props.selectedId, (id) => {
      const selectedId = id ?? null;
      const meridianId = meridians.some((item) => item.id === selectedId) ? selectedId : null;
      if (bronzeHuman && meridianId !== renderedMeridianId) rebuildSurfaceMeridians(selectedId);
      else highlightSelection(selectedId);
    });
    onMounted(createScene);
    onBeforeUnmount(() => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      if (renderer) renderer.domElement.removeEventListener("pointerdown", handlePointer);
      controls?.removeEventListener("change", requestRender);
      controls?.dispose();
      if (scene) disposeObject(scene);
      if (projectionSurface) disposeObject(projectionSurface);
      projectionSurface = void 0;
      renderer?.dispose();
      renderer?.domElement.remove();
      meridianLabels.forEach(({ element }) => element.remove());
      meridianLabels.clear();
      acupointLabels.forEach(({ element }) => element.remove());
      acupointLabels.clear();
      interactiveObjects.length = 0;
      flowingParticles.length = 0;
      meridianLines.length = 0;
      acupointMarkers.length = 0;
    });
    __expose({ setView, resetView });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "container",
        ref: container,
        class: "human-viewport"
      }, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "viewport-hint" }, " 拖动旋转 · 滚轮缩放 · 点击经络查看经穴 ", -1)),
        isModelLoading.value ? (openBlock(), createElementBlock("div", _hoisted_1$1, " 正在加载仿真经络铜人… ")) : modelLoadError.value ? (openBlock(), createElementBlock("div", _hoisted_2$1, " 铜人模型加载失败，当前使用简化备用模型 ")) : surfaceFitError.value ? (openBlock(), createElementBlock("div", _hoisted_3$1, " 经络贴肤计算失败，当前使用基础经络位置 ")) : createCommentVNode("", true),
        renderError.value ? (openBlock(), createElementBlock("div", _hoisted_4$1, " 3D 渲染初始化失败，请检查显卡驱动或关闭硬件加速后重试。 ")) : createCommentVNode("", true)
      ], 512);
    };
  }
});
const HumanMeridian3D = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-5c2c0995"]]);
const _hoisted_1 = { class: "list-name" };
const _hoisted_2 = { class: "list-pinyin" };
const _hoisted_3 = { class: "list-name" };
const _hoisted_4 = { class: "detail-pinyin" };
const _hoisted_5 = { key: 2 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HumanMeridianView",
  setup(__props) {
    const meridianData = [
      { id: "lung", name: "手太阴肺经", pinyin: "Shǒu Tài Yīn Fèi Jīng", category: "十二正经", overview: "属阴经，与手阳明大肠经相表里，是十二经脉气血流注的起始经脉之一。", route: "起于中焦，下络大肠，返循胃口，上膈属肺；体表支脉从胸部出发，沿上肢内侧前缘至拇指桡侧。", reference: "传统经络理论中主要联系肺系、胸部、咽喉以及上肢内侧前缘。", acupoints: ["中府", "尺泽", "列缺", "太渊", "少商"] },
      { id: "large-intestine", name: "手阳明大肠经", pinyin: "Shǒu Yáng Míng Dà Cháng Jīng", category: "十二正经", overview: "属阳经，与手太阴肺经相表里，从手走头，循行于上肢外侧前缘。", route: "起于食指桡侧，沿上肢外侧前缘上行，经过肩部、颈部进入面颊，止于对侧鼻旁。", reference: "传统经络理论中主要联系头面、鼻、口齿、咽喉和上肢外侧。", acupoints: ["商阳", "合谷", "曲池", "肩髃", "迎香"] },
      { id: "stomach", name: "足阳明胃经", pinyin: "Zú Yáng Míng Wèi Jīng", category: "十二正经", overview: "属阳经，与足太阴脾经相表里，从头走足，循行范围覆盖面部、胸腹和下肢前侧。", route: "起于鼻旁，上行至鼻根并联系目周，随后下行经过面颊、颈胸、腹部及下肢前外侧，止于第二趾外侧。", reference: "传统经络理论中主要联系胃腑、口齿、面部、胸腹和下肢前侧。", acupoints: ["承泣", "颊车", "天枢", "足三里", "丰隆", "内庭"] },
      { id: "spleen", name: "足太阴脾经", pinyin: "Zú Tài Yīn Pí Jīng", category: "十二正经", overview: "属阴经，与足阳明胃经相表里，从足走腹，循行于下肢内侧前缘。", route: "起于足大趾内侧，沿足内侧和下肢内侧上行，进入腹部属脾络胃，再上行至胸胁。", reference: "传统经络理论中主要联系脾胃、腹部、胸胁及下肢内侧。", acupoints: ["隐白", "太白", "三阴交", "阴陵泉", "血海"] },
      { id: "heart", name: "手少阴心经", pinyin: "Shǒu Shào Yīn Xīn Jīng", category: "十二正经", overview: "属阴经，与手太阳小肠经相表里，从胸走手，循行于上肢内侧后缘。", route: "起于心中，出属心系并下络小肠；体表支脉从腋下出发，沿上肢内侧后缘下行至小指桡侧。", reference: "传统经络理论中主要联系心胸、舌、目系以及上肢内侧。", acupoints: ["极泉", "少海", "通里", "神门", "少冲"] },
      { id: "small-intestine", name: "手太阳小肠经", pinyin: "Shǒu Tài Yáng Xiǎo Cháng Jīng", category: "十二正经", overview: "属阳经，与手少阴心经相表里，从手走头，循行于上肢外侧后缘。", route: "起于小指尺侧，沿手臂外侧后缘上行，经肩胛、颈部到达面颊和耳前。", reference: "传统经络理论中主要联系肩胛、颈项、耳、目和上肢外侧后缘。", acupoints: ["少泽", "后溪", "养老", "天宗", "听宫"] },
      { id: "bladder", name: "足太阳膀胱经", pinyin: "Zú Tài Yáng Páng Guāng Jīng", category: "十二正经", overview: "属阳经，与足少阴肾经相表里，是十二正经中体表循行最长、穴位较多的一条经脉。", route: "起于内眼角，上额越过头顶，沿背部脊柱两侧分支下行，经臀部和下肢后侧至小趾外侧。", reference: "传统经络理论中主要联系头项、眼、背腰、脏腑背俞部和下肢后侧。", acupoints: ["睛明", "肺俞", "肾俞", "委中", "昆仑", "至阴"] },
      { id: "kidney", name: "足少阴肾经", pinyin: "Zú Shào Yīn Shèn Jīng", category: "十二正经", overview: "属阴经，与足太阳膀胱经相表里，从足走胸，循行于下肢内侧后缘。", route: "起于足底，绕过内踝后方，沿下肢内侧上行，经过脊柱、肾和膀胱，再沿腹胸抵达锁骨下。", reference: "传统经络理论中主要联系肾系、腰脊、咽喉、胸腹和下肢内侧。", acupoints: ["涌泉", "太溪", "照海", "复溜", "俞府"] },
      { id: "pericardium", name: "手厥阴心包经", pinyin: "Shǒu Jué Yīn Xīn Bāo Jīng", category: "十二正经", overview: "属阴经，与手少阳三焦经相表里，从胸走手，循行于上肢内侧中线。", route: "起于胸中，属心包并下行联系三焦；体表支脉从胸胁出发，经腋下沿上肢内侧中线至中指尖。", reference: "传统经络理论中主要联系心胸、心包和上肢内侧中线。", acupoints: ["天池", "曲泽", "内关", "大陵", "劳宫", "中冲"] },
      { id: "triple-burner", name: "手少阳三焦经", pinyin: "Shǒu Shào Yáng Sān Jiāo Jīng", category: "十二正经", overview: "属阳经，与手厥阴心包经相表里，从手走头，循行于上肢外侧中线。", route: "起于无名指尺侧，沿手背和上肢外侧中线上行，经肩颈绕耳，止于眉梢外侧。", reference: "传统经络理论中主要联系耳、侧头、目外眦、肩臂和上肢外侧。", acupoints: ["关冲", "阳池", "外关", "支沟", "翳风", "丝竹空"] },
      { id: "gallbladder", name: "足少阳胆经", pinyin: "Zú Shào Yáng Dǎn Jīng", category: "十二正经", overview: "属阳经，与足厥阴肝经相表里，从头走足，循行于身体侧面。", route: "起于外眼角，曲折循行于侧头部，经肩、胁肋、髋部和下肢外侧下行，止于第四趾外侧。", reference: "传统经络理论中主要联系侧头、耳、目、胁肋、胆腑和下肢外侧。", acupoints: ["瞳子髎", "风池", "肩井", "环跳", "阳陵泉", "足临泣"] },
      { id: "liver", name: "足厥阴肝经", pinyin: "Zú Jué Yīn Gān Jīng", category: "十二正经", overview: "属阴经，与足少阳胆经相表里，从足走腹，循行于下肢内侧。", route: "起于足大趾背侧，沿足背和下肢内侧上行，绕阴器，进入少腹，属肝络胆并上达胁肋。", reference: "传统经络理论中主要联系肝胆、少腹、胁肋、目系和下肢内侧。", acupoints: ["大敦", "行间", "太冲", "曲泉", "期门"] },
      { id: "ren", name: "任脉", pinyin: "Rèn Mài", category: "奇经八脉", overview: "奇经八脉之一，行于人体前正中线，传统理论称为“阴脉之海”。", route: "起于胞中，下出会阴，沿腹部、胸部和颈部前正中线上行，到达下唇内，分支环绕口唇并联系目下。", reference: "传统经络理论中具有统任诸阴经、调节阴经气血的概括性作用。", acupoints: ["中极", "关元", "气海", "神阙", "膻中", "承浆"] },
      { id: "du", name: "督脉", pinyin: "Dū Mài", category: "奇经八脉", overview: "奇经八脉之一，主干行于人体后正中线，传统理论称为“阳脉之海”。", route: "起于胞中，下出会阴，沿脊柱后正中线上行，经项部进入脑内，再越过头顶沿额面下降至上唇。", reference: "传统经络理论中具有总督诸阳经、调节阳经气血的概括性作用。", acupoints: ["长强", "命门", "大椎", "百会", "水沟"] }
    ];
    const anatomyData = [
      { id: "brain", name: "脑", system: "神经系统", description: "位于颅腔内，是中枢神经系统的主要部分。" },
      { id: "heart", name: "心脏", system: "循环系统", description: "位于胸腔中纵隔，负责推动血液循环。" },
      { id: "left-lung", name: "左肺", system: "呼吸系统", description: "左肺通常分为两叶，与右肺共同完成气体交换。" },
      { id: "right-lung", name: "右肺", system: "呼吸系统", description: "右肺通常分为三叶，体积略大于左肺。" },
      { id: "liver", name: "肝脏", system: "消化系统", description: "位于右上腹，参与代谢、解毒、合成和胆汁分泌。" },
      { id: "stomach", name: "胃", system: "消化系统", description: "位于上腹部，是食物暂存和初步消化的重要器官。" },
      { id: "spleen", name: "脾脏", system: "免疫系统", description: "位于左上腹，参与免疫应答和血细胞处理。" },
      { id: "left-kidney", name: "左肾", system: "泌尿系统", description: "位于腹膜后，过滤血液并参与体液和电解质调节。" },
      { id: "right-kidney", name: "右肾", system: "泌尿系统", description: "通常因肝脏位置而略低于左肾。" },
      { id: "intestines", name: "肠道", system: "消化系统", description: "包括小肠和大肠，承担营养吸收和废物形成等功能。" },
      { id: "skull", name: "颅骨", system: "骨骼系统", description: "保护脑和头部感觉器官，并构成面部支架。" },
      { id: "skeleton", name: "骨骼", system: "骨骼系统", description: "为人体提供支撑、保护脏器并参与运动和造血。" }
    ];
    const viewer = ref(null);
    const showSkin = ref(true);
    const showMuscles = ref(false);
    const showSkeleton = ref(false);
    const showOrgans = ref(false);
    const showMeridians = ref(true);
    const flowSpeed = ref(1);
    const activeInfoTab = ref("meridian");
    const selected = ref({ id: "ren", name: "任脉", kind: "meridian" });
    const selectedMeridian = computed(() => meridianData.find((item) => item.id === selected.value.id) ?? null);
    const selectedAnatomy = computed(() => anatomyData.find((item) => item.id === selected.value.id) ?? null);
    function selectItem(selection) {
      if (!selection) return;
      selected.value = selection;
      activeInfoTab.value = selection.kind === "meridian" ? "meridian" : "anatomy";
    }
    function selectMeridian(item) {
      selected.value = { id: item.id, name: item.name, kind: "meridian" };
      showMeridians.value = true;
      activeInfoTab.value = "meridian";
    }
    function selectAnatomy(item) {
      selected.value = { id: item.id, name: item.name, kind: item.system === "骨骼系统" ? "skeleton" : "organ" };
      if (item.system === "骨骼系统") showSkeleton.value = true;
      else showOrgans.value = true;
      activeInfoTab.value = "anatomy";
    }
    function applyMode(mode) {
      if (mode === "meridian") {
        showSkin.value = true;
        showMuscles.value = false;
        showSkeleton.value = false;
        showOrgans.value = false;
        showMeridians.value = true;
      } else if (mode === "anatomy") {
        showSkin.value = false;
        showMuscles.value = false;
        showSkeleton.value = true;
        showOrgans.value = true;
        showMeridians.value = false;
      } else if (mode === "muscle") {
        showSkin.value = false;
        showMuscles.value = true;
        showSkeleton.value = true;
        showOrgans.value = false;
        showMeridians.value = false;
      } else {
        showSkin.value = true;
        showMuscles.value = false;
        showSkeleton.value = true;
        showOrgans.value = true;
        showMeridians.value = true;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$2, {
        title: "人体经络与解剖 3D",
        description: "仿真针灸经络铜人，可查看经络流向、常用穴位和人体解剖分层"
      }, {
        actions: withCtx(() => [
          createVNode(unref(NButtonGroup), null, {
            default: withCtx(() => [
              createVNode(unref(Button), {
                onClick: _cache[0] || (_cache[0] = ($event) => applyMode("meridian"))
              }, {
                default: withCtx(() => [..._cache[15] || (_cache[15] = [
                  createTextVNode(" 经络铜人 ", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), {
                onClick: _cache[1] || (_cache[1] = ($event) => applyMode("anatomy"))
              }, {
                default: withCtx(() => [..._cache[16] || (_cache[16] = [
                  createTextVNode(" 解剖模式 ", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), {
                onClick: _cache[2] || (_cache[2] = ($event) => applyMode("muscle"))
              }, {
                default: withCtx(() => [..._cache[17] || (_cache[17] = [
                  createTextVNode(" 肌肉骨骼 ", -1)
                ])]),
                _: 1
              }),
              createVNode(unref(Button), {
                type: "primary",
                onClick: _cache[3] || (_cache[3] = ($event) => applyMode("combined"))
              }, {
                default: withCtx(() => [..._cache[18] || (_cache[18] = [
                  createTextVNode(" 综合显示 ", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        default: withCtx(() => [
          createVNode(unref(NGrid), {
            cols: 24,
            "x-gap": 14,
            responsive: "screen"
          }, {
            default: withCtx(() => [
              createVNode(unref(NGridItem), { span: 5 }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    title: "显示图层",
                    size: "small",
                    class: "side-card"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(NSpace), { vertical: "" }, {
                        default: withCtx(() => [
                          createVNode(unref(NCheckbox), {
                            checked: showSkin.value,
                            "onUpdate:checked": _cache[4] || (_cache[4] = ($event) => showSkin.value = $event)
                          }, {
                            default: withCtx(() => [..._cache[19] || (_cache[19] = [
                              createTextVNode(" 半透明皮肤 ", -1)
                            ])]),
                            _: 1
                          }, 8, ["checked"]),
                          createVNode(unref(NCheckbox), {
                            checked: showMuscles.value,
                            "onUpdate:checked": _cache[5] || (_cache[5] = ($event) => showMuscles.value = $event)
                          }, {
                            default: withCtx(() => [..._cache[20] || (_cache[20] = [
                              createTextVNode(" 肌肉层 ", -1)
                            ])]),
                            _: 1
                          }, 8, ["checked"]),
                          createVNode(unref(NCheckbox), {
                            checked: showSkeleton.value,
                            "onUpdate:checked": _cache[6] || (_cache[6] = ($event) => showSkeleton.value = $event)
                          }, {
                            default: withCtx(() => [..._cache[21] || (_cache[21] = [
                              createTextVNode(" 骨骼层 ", -1)
                            ])]),
                            _: 1
                          }, 8, ["checked"]),
                          createVNode(unref(NCheckbox), {
                            checked: showOrgans.value,
                            "onUpdate:checked": _cache[7] || (_cache[7] = ($event) => showOrgans.value = $event)
                          }, {
                            default: withCtx(() => [..._cache[22] || (_cache[22] = [
                              createTextVNode(" 主要脏器 ", -1)
                            ])]),
                            _: 1
                          }, 8, ["checked"]),
                          createVNode(unref(NCheckbox), {
                            checked: showMeridians.value,
                            "onUpdate:checked": _cache[8] || (_cache[8] = ($event) => showMeridians.value = $event)
                          }, {
                            default: withCtx(() => [..._cache[23] || (_cache[23] = [
                              createTextVNode(" 经络流动 ", -1)
                            ])]),
                            _: 1
                          }, 8, ["checked"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDivider)),
                      _cache[28] || (_cache[28] = createBaseVNode("div", { class: "control-label" }, " 经络流速 ", -1)),
                      createVNode(unref(NSlider), {
                        value: flowSpeed.value,
                        "onUpdate:value": _cache[9] || (_cache[9] = ($event) => flowSpeed.value = $event),
                        min: 0.2,
                        max: 3,
                        step: 0.1
                      }, null, 8, ["value"]),
                      createVNode(unref(NDivider)),
                      _cache[29] || (_cache[29] = createBaseVNode("div", { class: "control-label" }, " 观察方向 ", -1)),
                      createVNode(unref(NSpace), null, {
                        default: withCtx(() => [
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: _cache[10] || (_cache[10] = ($event) => viewer.value?.setView("front"))
                          }, {
                            default: withCtx(() => [..._cache[24] || (_cache[24] = [
                              createTextVNode(" 正面 ", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: _cache[11] || (_cache[11] = ($event) => viewer.value?.setView("back"))
                          }, {
                            default: withCtx(() => [..._cache[25] || (_cache[25] = [
                              createTextVNode(" 背面 ", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: _cache[12] || (_cache[12] = ($event) => viewer.value?.setView("left"))
                          }, {
                            default: withCtx(() => [..._cache[26] || (_cache[26] = [
                              createTextVNode(" 左侧 ", -1)
                            ])]),
                            _: 1
                          }),
                          createVNode(unref(Button), {
                            size: "small",
                            onClick: _cache[13] || (_cache[13] = ($event) => viewer.value?.setView("right"))
                          }, {
                            default: withCtx(() => [..._cache[27] || (_cache[27] = [
                              createTextVNode(" 右侧 ", -1)
                            ])]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(NDivider)),
                      createVNode(unref(NTabs), {
                        value: activeInfoTab.value,
                        "onUpdate:value": _cache[14] || (_cache[14] = ($event) => activeInfoTab.value = $event),
                        size: "small",
                        type: "segment"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(NTabPane), {
                            name: "meridian",
                            tab: "经络"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NList), {
                                hoverable: "",
                                clickable: "",
                                class: "item-list"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(), createElementBlock(Fragment, null, renderList(meridianData, (item) => {
                                    return createVNode(unref(NListItem), {
                                      key: item.id,
                                      class: normalizeClass({ active: selected.value.id === item.id }),
                                      onClick: ($event) => selectMeridian(item)
                                    }, {
                                      default: withCtx(() => [
                                        createBaseVNode("div", _hoisted_1, toDisplayString(item.name), 1),
                                        createBaseVNode("div", _hoisted_2, toDisplayString(item.pinyin), 1),
                                        createVNode(unref(NTag), {
                                          size: "tiny",
                                          bordered: false
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.category), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["class", "onClick"]);
                                  }), 64))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(NTabPane), {
                            name: "anatomy",
                            tab: "解剖"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(NList), {
                                hoverable: "",
                                clickable: "",
                                class: "item-list"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(), createElementBlock(Fragment, null, renderList(anatomyData, (item) => {
                                    return createVNode(unref(NListItem), {
                                      key: item.id,
                                      class: normalizeClass({ active: selected.value.id === item.id }),
                                      onClick: ($event) => selectAnatomy(item)
                                    }, {
                                      default: withCtx(() => [
                                        createBaseVNode("div", _hoisted_3, toDisplayString(item.name), 1),
                                        createVNode(unref(NTag), {
                                          size: "tiny",
                                          bordered: false
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.system), 1)
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1032, ["class", "onClick"]);
                                  }), 64))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["value"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), { span: 14 }, {
                default: withCtx(() => [
                  createVNode(HumanMeridian3D, {
                    ref_key: "viewer",
                    ref: viewer,
                    "show-skin": showSkin.value,
                    "show-muscles": showMuscles.value,
                    "show-skeleton": showSkeleton.value,
                    "show-organs": showOrgans.value,
                    "show-meridians": showMeridians.value,
                    "flow-speed": flowSpeed.value,
                    "selected-id": selected.value.id,
                    onSelect: selectItem
                  }, null, 8, ["show-skin", "show-muscles", "show-skeleton", "show-organs", "show-meridians", "flow-speed", "selected-id"])
                ]),
                _: 1
              }),
              createVNode(unref(NGridItem), { span: 5 }, {
                default: withCtx(() => [
                  createVNode(unref(NCard), {
                    title: "当前选中",
                    size: "small",
                    class: "side-card detail-card"
                  }, {
                    default: withCtx(() => [
                      selectedMeridian.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                        createVNode(unref(NSpace), {
                          align: "center",
                          justify: "space-between"
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("div", null, [
                              createBaseVNode("h3", null, toDisplayString(selectedMeridian.value.name), 1),
                              createBaseVNode("div", _hoisted_4, toDisplayString(selectedMeridian.value.pinyin), 1)
                            ]),
                            createVNode(unref(NTag), { type: "success" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(selectedMeridian.value.category), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(NDivider), { "title-placement": "left" }, {
                          default: withCtx(() => [..._cache[30] || (_cache[30] = [
                            createTextVNode(" 经络简介 ", -1)
                          ])]),
                          _: 1
                        }),
                        createBaseVNode("p", null, toDisplayString(selectedMeridian.value.overview), 1),
                        createVNode(unref(NDivider), { "title-placement": "left" }, {
                          default: withCtx(() => [..._cache[31] || (_cache[31] = [
                            createTextVNode(" 循行路线 ", -1)
                          ])]),
                          _: 1
                        }),
                        createBaseVNode("p", null, toDisplayString(selectedMeridian.value.route), 1),
                        createVNode(unref(NDivider), { "title-placement": "left" }, {
                          default: withCtx(() => [..._cache[32] || (_cache[32] = [
                            createTextVNode(" 常用穴位 ", -1)
                          ])]),
                          _: 1
                        }),
                        createVNode(unref(NSpace), null, {
                          default: withCtx(() => [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(selectedMeridian.value.acupoints, (acupoint) => {
                              return openBlock(), createBlock(unref(NTag), {
                                key: acupoint,
                                size: "small",
                                type: "success",
                                bordered: false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(acupoint), 1)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 1
                        }),
                        createVNode(unref(NDivider), { "title-placement": "left" }, {
                          default: withCtx(() => [..._cache[33] || (_cache[33] = [
                            createTextVNode(" 传统理论参考 ", -1)
                          ])]),
                          _: 1
                        }),
                        createBaseVNode("p", null, toDisplayString(selectedMeridian.value.reference), 1),
                        createVNode(unref(NAlert), {
                          type: "warning",
                          bordered: false
                        }, {
                          default: withCtx(() => [..._cache[34] || (_cache[34] = [
                            createTextVNode(" 经络路径为教学示意，不代表精确穴位定位，不能用于诊断或替代专业医疗意见。 ", -1)
                          ])]),
                          _: 1
                        })
                      ], 64)) : selectedAnatomy.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                        createVNode(unref(NSpace), { align: "center" }, {
                          default: withCtx(() => [
                            createBaseVNode("h3", null, toDisplayString(selectedAnatomy.value.name), 1),
                            createVNode(unref(NTag), { type: "info" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(selectedAnatomy.value.system), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(NDivider), { "title-placement": "left" }, {
                          default: withCtx(() => [..._cache[35] || (_cache[35] = [
                            createTextVNode(" 结构说明 ", -1)
                          ])]),
                          _: 1
                        }),
                        createBaseVNode("p", null, toDisplayString(selectedAnatomy.value.description), 1),
                        createVNode(unref(NAlert), {
                          type: "info",
                          bordered: false
                        }, {
                          default: withCtx(() => [..._cache[36] || (_cache[36] = [
                            createTextVNode(" 解剖模型采用简化比例，用于结构认知和照护培训，不作为医学影像或手术定位依据。 ", -1)
                          ])]),
                          _: 1
                        })
                      ], 64)) : (openBlock(), createElementBlock("p", _hoisted_5, "点击人体上的经络、器官或骨骼查看说明。"))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
const HumanMeridianView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-809a08b7"]]);
export {
  HumanMeridianView as default
};
