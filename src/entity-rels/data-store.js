import {writable} from "svelte/store";
import _ from "lodash";


const entities = {
    application: {id: 1, name: 'Application', primary: true},
    orgUnit: {id: 2, name: 'Organisational Unit', primary: true},
    changeInitiative: {id: 3, name: 'Change Initiative', primary: true},
    person: {id: 4, name: 'Person', primary: true},
    measurable: {id: 5, name: 'Measurable', primary: true},
    measurableCategory: {id: 6, name: 'Measurable Category', primary: true},
    measurableRating: {id: 7, name: 'Measurable Rating'},
    assessment: {id: 8, name: 'Assessment'},
    assessmentDefinition: {id: 9, name: 'Assessment Definition'},
    involvement: {id: 10, name: 'Involvement'},
    involvementKind: {id: 11, name: 'Involvement Kind'},
    actor: {id: 12, name: 'Actor', primary: true},
    logicalFlow: {id: 13, name: 'Logical Flow', primary: true},
    physicalFlow: {id: 14, name: 'Physical Flow'},
    physicalSpecification: {id: 15, name: 'Physical Specification'},
    dataType: {id: 16, name: 'Data Type', primary: true},
    surveyTemplate: {id: 17, name: 'Survey Template'},
    surveyQuestion: {id: 18, name: 'Survey Question'},
    surveyInstance: {id: 19, name: 'Survey Instance'},
    surveyQuestionResponse: {id: 20, name: 'Survey Question Response'},
    bookmark: {id: 21, name: 'Bookmark'},
    cost: {id: 22, name: 'Cost'},
    costKind: {id: 23, name: 'Cost Kind'},
    flowDiagram: {id: 24, name: 'Flow Diagram'},
    ratingScheme: {id: 25, name: 'Rating Scheme'},
    ratingSchemeItem: {id: 26, name: 'Rating Scheme Item'}
};

const relTypes = {
    owns: {id: 1, name: ["Owns", "Owned by"]},
    has: {id: 2, name: ["Has", "Referenced"]},
    describes: {id: 2, name: ["Described By", "Describes"]},
    refs: {id: 2, name: ["References", "Referenced By"]},
};

const relationships = [
    { source: entities.orgUnit, target: entities.application, type: relTypes.owns, cardinality: "1n"},
    { source: entities.application, target: entities.involvement, type: relTypes.has, cardinality: "1n"},
    { source: entities.orgUnit, target: entities.involvement, type: relTypes.has, cardinality: "1n"},
    { source: entities.changeInitiative, target: entities.involvement, type: relTypes.has, cardinality: "1n"},
    { source: entities.measurable, target: entities.involvement, type: relTypes.has, cardinality: "1n"},
    { source: entities.involvementKind, target: entities.involvement, type: relTypes.has, cardinality: "1n"},
    { source: entities.involvement, target: entities.person, type: relTypes.refs, cardinality: "1n"},
    { source: entities.application, target: entities.logicalFlow, type: relTypes.has, cardinality: "1n"},
    { source: entities.logicalFlow, target: entities.dataType, type: relTypes.describes, cardinality: "1n"},
    { source: entities.measurableCategory, target: entities.measurable, type: relTypes.owns, cardinality: "1n"},
    { source: entities.measurableCategory, target: entities.ratingScheme, type: relTypes.has, cardinality: "1"},
    { source: entities.measurableRating, target: entities.measurable, type: relTypes.refs, cardinality: "1"},
    { source: entities.measurableRating, target: entities.ratingSchemeItem, type: relTypes.refs, cardinality: "1"},
    { source: entities.application, target: entities.measurable, type: relTypes.has, cardinality: "1n"},
    { source: entities.application, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.changeInitiative, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.orgUnit, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.dataType, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.measurable, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.measurableCategory, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.actor, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.physicalFlow, target: entities.bookmark, type: relTypes.has, cardinality: "1n"},
    { source: entities.logicalFlow, target: entities.physicalFlow, type: relTypes.has, cardinality: "1n"},
    { source: entities.physicalSpecification, target: entities.physicalFlow, type: relTypes.describes, cardinality: "1n"},
    { source: entities.physicalSpecification, target: entities.physicalFlow, type: relTypes.describes, cardinality: "1n"},
    { source: entities.surveyTemplate, target: entities.surveyQuestion, type: relTypes.has, cardinality: "1n"},
    { source: entities.surveyQuestionResponse, target: entities.surveyQuestion, type: relTypes.refs, cardinality: "1n"},
    { source: entities.surveyTemplate, target: entities.surveyInstance, type: relTypes.has, cardinality: "1n"},
    { source: entities.surveyInstance, target: entities.surveyQuestionResponse, type: relTypes.has, cardinality: "1n"},
    { source: entities.application, target: entities.surveyInstance, type: relTypes.has, cardinality: "1n"},
    { source: entities.changeInitiative, target: entities.surveyInstance, type: relTypes.has, cardinality: "1n"},
    { source: entities.costKind, target: entities.cost, type: relTypes.has, cardinality: "1n"},
    { source: entities.application, target: entities.cost, type: relTypes.has, cardinality: "1n"},
    { source: entities.flowDiagram, target: entities.logicalFlow, type: relTypes.has, cardinality: "1n"},
    { source: entities.flowDiagram, target: entities.actor, type: relTypes.has, cardinality: "1n"},
    { source: entities.flowDiagram, target: entities.application, type: relTypes.has, cardinality: "1n"},
    { source: entities.assessmentDefinition, target: entities.assessment, type: relTypes.has, cardinality: "1n"},
    { source: entities.assessmentDefinition, target: entities.ratingScheme, type: relTypes.has, cardinality: "1n"},
    { source: entities.assessment, target: entities.ratingSchemeItem, type: relTypes.has, cardinality: "1n"},
    { source: entities.application, target: entities.assessment, type: relTypes.has, cardinality: "1n"},
    { source: entities.changeInitiative, target: entities.assessment, type: relTypes.has, cardinality: "1n"},
    { source: entities.changeInitiative, target: entities.assessment, type: relTypes.has, cardinality: "1n"},
];


export const model = writable({
    entities: _.values(entities),
    relationships
});

