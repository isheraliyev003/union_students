import { UNIVERSITIES_CATALOG } from '../data/universitiesCatalog.js'

/** Options for signup — derived from catalog so IDs stay aligned. */
export const UNIVERSITIES = UNIVERSITIES_CATALOG.map(({ id, name }) => ({ id, name }))
