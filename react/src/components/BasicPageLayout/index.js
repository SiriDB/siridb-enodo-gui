import Grid from '@material-ui/core/Grid';
import React from 'react';


const BasicPageLayout = ({ title, buttonAction, buttonText, children }) => {

    return (
        <Grid container direction='column' spacing={2}>
            <Grid item>
                <div>
                    <div style={{ float: "left" }}>
                        <h2>{title}</h2>
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
