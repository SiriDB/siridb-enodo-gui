import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const BasicPageLayout = ({ title, buttonAction, buttonText, children }) => {

    return (
        <Grid container direction='column' spacing={2}>
            <Grid item>
                <div>
                    <div style={{ float: "left" }}>
                        <Typography variant='h4' gutterBottom>{title}</Typography>
                    </div>
                    <div style={{ float: "right" }}>
                        {buttonAction && buttonText &&
                            <button type="button" className="btn btn-primary" onClick={buttonAction}>
                                {buttonText}
                            </button>}
                    </div>
                    <div style={{ clear: "both" }}></div>
                </div>
            </Grid>
            <Grid item>
                {children}
            </Grid>
        </Grid>
    );
}

export default BasicPageLayout;