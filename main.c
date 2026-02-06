#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

struct node{
    int vertex_number;
    char name[3];
    int visit_flag;
    struct node *next;
};
typedef struct node node;

/* Add edge to adjacency list */
void new_edge(node *vertex, int vertex_number, char **names){
    node *new_node = (node *)malloc(sizeof(node));
    new_node->vertex_number = vertex_number;
    strcpy(new_node->name, names[vertex_number]);
    new_node->next = vertex->next;
    vertex->next = new_node;
}

/* Print adjacency list */
void traverse_adj_list(node *graph, int no_vertices){
    printf("Adjacency List\n");
    for (int i = 0; i < no_vertices; i++){
        node *temp = &graph[i];
        printf("%s --> ", temp->name);
        temp = temp->next;
        while (temp != NULL){
            printf("%s", temp->name);
            if (temp->next) printf(", ");
            temp = temp->next;
        }
        printf("\n");
    }
    printf("\n");
}

/* Deadlock detection */
void deadlock(node *graph, int no_processes, int no_vertices){
    node *process_vertex, *next;
    int counter = 0, deadlocked_processes[no_processes];

    for (int i = 0; i < no_processes; i++){
        process_vertex = &graph[i];
        printf("%s-->", process_vertex->name);
        process_vertex->visit_flag = 1;

        next = process_vertex->next;
        if (!next){
            printf("\n");
            continue;
        }

        printf("%s-->", next->name);

        while (next){
            next = &graph[next->vertex_number];
            next = next->next;
            if (!next) break;

            printf("%s-->", next->name);

            if (graph[next->vertex_number].visit_flag){
                if (next->vertex_number == process_vertex->vertex_number){
                    deadlocked_processes[counter++] = process_vertex->vertex_number;
                }
                break;
            }
            graph[next->vertex_number].visit_flag = 1;
        }
        printf("\n");

        for (int w = 0; w < no_vertices; w++)
            graph[w].visit_flag = 0;
    }

    if (counter == 0){
        printf("\nNo Deadlocked Process\n");
        return;
    }

    printf("\nDeadlocked Processes: ");
    for (int i = 0; i < counter; i++)
        printf("%s ", graph[deadlocked_processes[i]].name);
    printf("\n\n");
}

/* Count unique single-digit resources */
int resource_count(char buffer[]){
    char copy[150];
    strcpy(copy, buffer);
    int count = 0;

    for (int i = 0; copy[i]; i++){
        if (isdigit(copy[i])){
            count++;
            for (int j = i + 1; copy[j]; j++){
                if (copy[j] == copy[i]){
                    memmove(&copy[j], &copy[j + 1], strlen(copy) - j);
                    j--;
                }
            }
        }
    }
    return count;
}

int main(){
    char buffer[150] = {0};
    char line[50];
    int no_processes = 0;

    printf("Enter input (Ctrl+D to finish):\n");

    while (fgets(line, sizeof(line), stdin)){
        no_processes++;
        for (int i = 0; line[i]; i++){
            if (line[i] == 'P'){
                i += 2; // skip P and digit
                continue;
            }
            if (line[i] == '\n'){
                strcat(buffer, ":\n");
            } else {
                strncat(buffer, &line[i], 1);
            }
        }
    }

    if (buffer[strlen(buffer) - 2] == ':')
        no_processes--;

    int no_resources = resource_count(buffer);
    int no_vertices = no_processes + no_resources;

    printf("\nParsed String:\n%s\n", buffer);
    printf("Processes: %d\nResources: %d\n\n", no_processes, no_resources);

    char *names[no_vertices];
    char v_name[3];

    for (int i = 0; i < no_processes; i++){
        sprintf(v_name, "P%d", i + 1);
        names[i] = strdup(v_name);
    }

    for (int i = 0; i < no_resources; i++){
        sprintf(v_name, "R%d", i + 1);
        names[no_processes + i] = strdup(v_name);
    }

    node graph[no_vertices];
    for (int i = 0; i < no_vertices; i++){
        graph[i].vertex_number = i;
        graph[i].visit_flag = 0;
        strcpy(graph[i].name, names[i]);
        graph[i].next = NULL;
    }

    int process_vertex = 0, swap = 0;

    for (int k = 0; buffer[k]; k++){
        if (buffer[k] == ')') swap = 1;
        if (buffer[k] == ':'){
            process_vertex++;
            swap = 0;
        }
        if (isdigit(buffer[k])){
            int x = buffer[k] - '0' + no_processes - 1;
            if (swap)
                new_edge(&graph[process_vertex], x, names);
            else
                new_edge(&graph[x], process_vertex, names);
        }
    }

    traverse_adj_list(graph, no_vertices);
    printf("Modified Depth First Search Traversal Path\n");
    deadlock(graph, no_processes, no_vertices);

    return 0;
}
