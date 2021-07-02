import * as chroma from 'chroma-js';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export function historyGetQueryParam(history, name) {
    const params = new URLSearchParams(history.location.search);
    const result = params.get(name);
    return result;
}

export function healthToText(severity) {
    const sevs = ["low", "medium", "high"];
    const x = Math.floor((1 / (3 + 1)) * (((3 - 1) * severity) + 1) * sevs.length);
    return sevs[x];
};

export function healthToColor(domain, severity) {
    return chroma.scale([red[500], orange[500], green[500]]).domain(domain)(severity);
};
