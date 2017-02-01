import {
    AlgorithmBase,
    AlgorithmState,
    TrackedVariable,
    getLabelIfDefined,
    KindExporter
} from './algorithm-base';
import {NormalizedState} from './algorithm.service';
import {Graph, GraphEdge} from '../models/graph.model';
import {Min} from '../data-structures/util';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';

class State extends AlgorithmState {

    @KindExporter('node') @TrackedVariable() public root: string;
    @KindExporter('node') @TrackedVariable() public Q: string[];
    @KindExporter('node-number') @TrackedVariable() public distance: string[][];
    @KindExporter('node-node') @TrackedVariable() public previous: string[][];
    @KindExporter('node') @TrackedVariable() public u: string;
    @KindExporter('edge') @TrackedVariable() public neighborEdges: string[];
    @KindExporter('edge') @TrackedVariable() public edge: string[];
    @KindExporter('number') @TrackedVariable() public alt: number;

    constructor(o: CreateNewStateObject) {
        super(o.graph, o.lineNumber);
        this.Q = getLabelIfDefined(o.graph, o.Q ? Array.from(o.Q) : undefined);

        if (o.distance == null) {
            this.distance = <null|undefined>o.distance;
        } else {
            this.distance = Array.from(o.distance).map((dist: [string, number]) => {
                return [
                    o.graph.getNodeLabel(dist[0]),
                    dist[1].toString(),
                ];
            });
        }

        if (o.previous == null) {
            this.previous = <null|undefined>o.previous;
        } else {
            this.previous = Array.from(o.previous).map((prev: [string, string]) => {
                return prev.map(p => getLabelIfDefined(o.graph, p));
            });
        }

        this.u = getLabelIfDefined(o.graph, o.u);
        this.neighborEdges = o.neighborEdges ?
            o.neighborEdges.map(edge => edge.label) :
            <any>o.neighborEdges;
        this.edge = o.edge ? o.graph.getEdgeLabel(o.edge) : <any>o.edge;
        this.alt = o.alt;
        this.root = getLabelIfDefined(o.graph, o.root);
    }

}

interface CreateNewStateObject {
    graph?: Graph;
    lineNumber?: number;
    Q?: Set<string>;
    distance?: Map<string, number>;
    previous?: Map<string, string>;
    u?: string;
    neighborEdges?: GraphEdge[];
    edge?: string;
    alt?: number;
    root?: string;
}

export class DijkstraShortestPathAlgorithm extends AlgorithmBase {

    public states: AlgorithmState[];

    public name: string = 'Dijkstra Shortest Path';

    public abbr: string = 'dsp';

    public code: string = `function DijkstraShortestPath(graph, root) {
  let Q = new Set();
  let distance = new Map();
  let previous = new Map();
  graph.node.forEach(node => {
    distance.set(node, Infinity);
    previous.set(node, null);
    Q.add(node);
  });
  distance.set(root, 0);
  
  while(!Q.isEmpty()) {
    let u = minInQ(distance).key;
    Q.delete(u);
    
    let neighborEdges = graph.neighbors(u);
    neighborEdges.filter(edge => Q.has(edge.to))
      .forEach(edge => {
        let alt = distance.get(u) + edge.weight;
        if (alt < distance.get(edge.to)) {
          distance.set(edge.to, alt);
          previous.set(edge.to, u);
        }
    });
  }
  
  return [distance, previous];
}`;

    public trackedVariables: string[] = ['Q', 'distance', 'previous', 'u', 'neighborEdges',
        'edge', 'alt'];

    public normalize(state: State): NormalizedState {
        const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map((node, i) => {
            return {
                id: node.id,
                label: node.label,
                position: node.position,
                weight: node.weight,
                isStart: state.root == node.id,
                isEnd: false,
                isAccentColor: state.u == node.id,
                isPrimaryColor: false,
                isSecondaryColor: false,
                isDimmedColor: false,
                annotations: [
                    {
                        position: 'ne',
                        text: node.weight.toString(),
                        style: 'black',
                    },
                ],
            };
        });
        const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;
        const accentColor: string[] = [];
        const primaryColor: string[] = [];
        const secondaryColor: string[] = [];

        return {nodes, edges, accentColor, primaryColor, secondaryColor};
    }

    public evaluateStatesFor(graph: Graph, root: string): State[] {
        let states: State[] = [];

        states.push(new State({graph, lineNumber: 1}));
        states.push(new State({graph, lineNumber: 2, root}));

        let Q = new Set<string>();
        states.push(new State({graph, lineNumber: 3, Q, root}));

        let distance = new Map<string, number>();
        states.push(new State({graph, lineNumber: 4, Q, distance, root}));

        let previous = new Map<string, string>();
        states.push(new State({graph, lineNumber: 5, Q, distance, previous, root}));

        graph.nodes.forEach(node => {
            distance.set(node.id, Infinity);
            previous.set(node.id, null);
            Q.add(node.id);
        });
        states.push(new State({graph, lineNumber: 10, Q, distance, previous, root}));

        distance.set(root, 0);
        states.push(new State({graph, lineNumber: 12, Q, distance, previous, root}));

        while (Q.size != 0) {
            states.push(new State({graph, lineNumber: 13, Q, distance, previous, root}));

            const distanceArr = Array.from(distance).filter(kv => Q.has(kv[0]));
            let u: string = Min(new Map(distanceArr), (a, b) => a[1] > b[1] ? 1 : -1)[0];
            states.push(new State({graph, lineNumber: 14, Q, distance, previous, u, root}));

            Q.delete(u);
            states.push(new State({graph, lineNumber: 16, Q, distance, previous, u, root}));

            let neighborEdges: GraphEdge[] = graph.getSources(u);
            states.push(new State({
                graph, lineNumber: 17, Q, distance, previous, u, neighborEdges, root
            }));

            neighborEdges = neighborEdges.filter(edge => Q.has(edge.to));
            states.push(new State({
                graph, lineNumber: 18, Q, distance, previous, u, neighborEdges, root
            }));

            neighborEdges
                .forEach(edge => {
                    states.push(new State({
                        graph,
                        lineNumber: 19,
                        Q,
                        distance,
                        previous,
                        u,
                        neighborEdges,
                        edge: edge.id,
                        root
                    }));

                    let alt = distance.get(u) + edge.weight;
                    states.push(new State({
                        graph,
                        lineNumber: 20,
                        Q,
                        distance,
                        previous,
                        u,
                        neighborEdges,
                        edge: edge.id,
                        root
                    }));

                    if (alt < distance.get(edge.to)) {

                        distance.set(edge.to, alt);
                        states.push(new State({
                            graph,
                            lineNumber: 21,
                            Q,
                            distance,
                            previous,
                            u,
                            neighborEdges,
                            edge: edge.id,
                            alt,
                            root
                        }));

                        previous.set(edge.to, u);
                        states.push(new State({
                            graph,
                            lineNumber: 22,
                            Q,
                            distance,
                            previous,
                            u,
                            neighborEdges,
                            edge: edge.id,
                            root
                        }));
                    }
                    states.push(new State({
                        graph,
                        lineNumber: 18,
                        Q,
                        distance,
                        previous,
                        u,
                        neighborEdges,
                        edge: edge.id,
                        root
                    }));
                });
            states.push(new State({
                graph, lineNumber: 12, Q, distance, previous, u, neighborEdges, root
            }));
        }

        states.push(new State({graph, lineNumber: 27, Q, distance, previous, root}));
        this.states = states;
        return states;
    }


}
