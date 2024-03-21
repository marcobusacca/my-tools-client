// IMPORTO REACTIVE DA VUE
import { reactive } from "vue";

// ESPORTO LA CONSTANTE STORE CONTENENTE TUTTI GLI ELEMENTI ACCESSIBILI AD OGNI COMPONENTE VUE
export const store = reactive({
    baseUrl: 'http://127.0.0.1:8080',
    loading: false,

    todolist: {
        "tasksNotDone": [],
        "tasksDone": [],
        "tasksCategories": [],
        "taskNotDoneCounter": 0,
    },

    tracker: {
        "totalExpenses": [],
        "activeWallets": [],
        "disabledWallets": [],
    },
});