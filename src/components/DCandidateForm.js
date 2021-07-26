import React, { useEffect } from "react";
import { Grid, TextField, withStyles, Button } from "@material-ui/core";
import useForm from "./useForm";
import { connect } from "react-redux";
import * as actions from "../actions/dCandidate";
import { useToasts } from "react-toast-notifications";

const styles = theme => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            minWidth: 230,
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 230,
    },
    smMargin: {
        margin: theme.spacing(1)
    }
})

const initialFieldValues = {
    title: '',
    snippet: '',
    timestamp: new Date()
}

const DCandidateForm = ({ classes, ...props }) => {

    //toast msg.
    const { addToast } = useToasts()

    //validate()
    //validate({fullName:'jenny'})
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('title' in fieldValues)
            temp.title = fieldValues.title ? "" : "This field is required."
        if ('snippet' in fieldValues)
            temp.snippet = fieldValues.snippet ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFieldValues, validate, props.setCurrentId)

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const onSuccess = () => {
                resetForm()
                addToast("Submitted successfully", { appearance: 'success' })
            }
            if (props.currentId === 0)
                props.createDCandidate(values, onSuccess)
            else
                props.updateDCandidate(props.currentId, values, onSuccess)
        }
    }

    useEffect(() => {
        if (props.currentId !== 0) {
            setValues({
                ...props.dCandidateList.find(x => x.id === props.currentId)
            })
            setErrors({})
        }
    }, [props.currentId])


    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <h2>Create a new page</h2>
            <Grid container>

                <Grid item xs={6}>
                    <TextField
                        name="title"
                        variant="outlined"
                        label="title"
                        value={values.title}
                        onChange={handleInputChange}
                        {...(errors.title && { error: true, helperText: errors.title })}

                    />
                </Grid>
                <TextField
                    name="snippet"
                    variant="outlined"
                    label="snippet"
                    value={values.snippet}
                    onChange={handleInputChange}
                    {...(errors.snippet && { error: true, helperText: errors.snippet })}

                />
            </Grid>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit">
                    Summit
                </Button>
                <Button
                    variant="contained"
                    onClick={resetForm}>
                    Reset
                </Button>
            </div>
        </form>
    );
}

const mapStateToProps = state => ({
    dCandidateList: state.dCandidate.list
})

const mapActionToProps = {
    createDCandidate: actions.create,
    updateDCandidate: actions.update
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(DCandidateForm));