const noop = () => void 0
//// Translator

// (from: path, to: path) => (origin: obj, target: obj) => obj
const arrow = noop
// (arrows: arrow[]) => (origin: obj, target: obj) => obj
const bundle = noop
// (map: ObjectOf<string>) => [toThis: (obj) => obj, toThat: (obj) => obj]
const parseTranslationMap = noop
