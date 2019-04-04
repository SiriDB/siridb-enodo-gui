import React, {Component} from 'react';
import ReactPubSubStore from 'react-pubsub-store';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const columnStyle = {
    backgroundColor: "#e8e8e8"
};

class RepoGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            repos: []
        }
    }

    componentDidMount() {
        this.repoSubscription = ReactPubSubStore.subscribe("/repos", (response) => {
            console.log(response.data);
            this.setState({
                repos: response.data
            });
        })
    }

    componentWillUnmount() {
        this.repoSubscription.remove();
    }

    render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={8}>
                    <Paper style={columnStyle}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell numeric>Last version</TableCell>
                                    <TableCell numeric>Repo URL</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.repos.map((repo) => {
                                    return (
                                        <TableRow key={repo._doc_id}>
                                            <TableCell component="th" scope="row">
                                                {repo.project_name}
                                            </TableCell>
                                            <TableCell numeric>{repo.last_version}</TableCell>
                                            <TableCell numeric>{repo.url}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {/*<TableRow key={repo._doc_id}>*/}
                                    {/*<TableCell component="th" scope="row">*/}
                                        {/*{repo.project_name}*/}
                                    {/*</TableCell>*/}
                                    {/*<TableCell numeric>{repo.last_version}</TableCell>*/}
                                    {/*<TableCell numeric>{repo.url}</TableCell>*/}
                                {/*</TableRow>*/}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper style={columnStyle}>2</Paper>
                </Grid>
            </Grid>
        );
    }
}

export default RepoGrid;
