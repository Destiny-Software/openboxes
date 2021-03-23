import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { withRouter } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { getTranslate } from 'react-localize-redux';

import 'react-confirm-alert/src/react-confirm-alert.css';

import TextField from '../form-elements/TextField';
import SelectField from '../form-elements/SelectField';
import DateField from '../form-elements/DateField';
import { renderFormField } from '../../utils/form-utils';
import apiClient from '../../utils/apiClient';
import { showSpinner, hideSpinner, fetchCurrencies, fetchOrganizations } from '../../actions';
import Translate, { translateWithDefaultMessage } from '../../utils/Translate';

function validate(values) {
  const errors = {};

  if (!values.vendor) {
    errors.vendor = 'react.default.error.requiredField.label';
  }

  if (!values.vendorInvoiceNumber) {
    errors.vendorInvoiceNumber = 'react.default.error.requiredField.label';
  }

  if (!values.dateInvoiced) {
    errors.dateInvoiced = 'react.default.error.requiredField.label';
  }

  if (!values.currencyUom) {
    errors.currencyUom = 'react.default.error.requiredField.label';
  }

  return errors;
}

const FIELDS = {
  // Invoice Number will be auto-generated after first save request
  invoiceNumber: {
    type: TextField,
    label: 'react.invoice.invoiceNumber.label',
    defaultMessage: 'Invoice number',
    attributes: {
      disabled: true,
    },
  },
  // Vendor = Party's location
  vendor: {
    type: SelectField,
    label: 'react.Invoice.vendor.label',
    defaultMessage: 'Vendor',
    attributes: {
      required: true,
      showValueTooltip: true,
      objectValue: true,
    },
    getDynamicAttr: ({ organizations }) => ({
      options: organizations,
    }),
  },
  vendorInvoiceNumber: {
    type: TextField,
    label: 'react.invoice.vendorInvoiceNumber.label',
    defaultMessage: 'Vendor Invoice Number',
    attributes: {
      required: true,
    },
  },
  dateInvoiced: {
    type: DateField,
    label: 'react.invoice.invoiceDate.label',
    defaultMessage: 'Invoice Date',
    attributes: {
      required: true,
      dateFormat: 'MM/DD/YYYY',
      autoComplete: 'off',
    },
  },
  currencyUom: {
    label: 'react.invoice.currency.label',
    defaultMessage: 'Currency',
    type: SelectField,
    attributes: {
      required: true,
      showValueTooltip: true,
      objectValue: true,
    },
    getDynamicAttr: ({ currencies }) => ({
      options: currencies,
    }),
  },
};

class CreateInvoicePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: this.props.initialValues,
    };
  }

  componentDidMount() {
    if (!this.props.currenciesFetched && !this.props.organizationsFetched) {
      this.props.fetchCurrencies();
      this.props.fetchOrganizations();
    }
  }

  checkInvoiceChange(newValues) {
    if (!this.state.invoiceId) {
      return false;
    }

    const {
      vendor, vendorInvoiceNumber, dateInvoiced, currencyUom,
    } = this.props.initialValues;
    const vendorSelected = newValues.vendor && vendor;
    const vendorCheck = vendorSelected && newValues.vendor.id !== vendor.id;

    const vendorInvoiceNumberCheck = vendorInvoiceNumber !== newValues.vendorInvoiceNumber;
    const dateInvoicedCheck = dateInvoiced !== newValues.dateInvoiced;

    const currencyUomSelected = newValues.currencyUom && currencyUom;
    const currencyUomCheck = currencyUomSelected && newValues.vendor.id !== vendor.id;

    return (vendorCheck || vendorInvoiceNumberCheck || dateInvoicedCheck || currencyUomCheck);
  }

  saveInvoice(values) {
    if (values.vendor && values.vendorInvoiceNumber && values.dateInvoiced && values.currencyUom) {
      this.props.showSpinner();

      const invoiceUrl = `/openboxes/api/invoices/${values.id || ''}`;

      const payload = {
        vendor: values.vendor,
        vendorInvoiceNumber: values.vendorInvoiceNumber,
        dateInvoiced: values.dateInvoiced,
        'currencyUom.id': values.currencyUom,
      };

      apiClient.post(invoiceUrl, payload)
        .then((response) => {
          if (response.data) {
            const resp = response.data.data;
            this.props.history.push(`/openboxes/invoice/create/${resp.id}`);
            this.props.nextPage({
              ...values,
              invoiceId: resp.id,
              invoiceNumber: resp.invoiceNumber,
            });
            this.props.hideSpinner();
          }
        })
        .catch(() => {
          this.props.hideSpinner();
          return Promise.reject(new Error(this.props.translate('react.invoice.error.createInvoice.label', 'Could not create invoice')));
        });
    }
  }

  resetToInitialValues() {
    this.setState({
      values: {},
    }, () => this.setState({
      values: this.props.initialValues,
    }));
  }

  nextPage(values) {
    const showModal = this.checkInvoiceChange(values);
    if (!showModal) {
      this.saveInvoice(values);
    } else {
      confirmAlert({
        title: this.props.translate('react.invoice.confirmChange.label', 'Confirm change'),
        message: this.props.translate(
          'react.invoice.confirmChange.label',
          'Do you want to change invoice data?',
        ),
        buttons: [
          {
            label: this.props.translate('react.default.no.label', 'No'),
            onClick: () => this.resetToInitialValues(),
          },
          {
            label: this.props.translate('react.default.yes.label', 'Yes'),
            onClick: () => this.saveInvoice(values),
          },
        ],
      });
    }
  }

  render() {
    return (
      <Form
        onSubmit={values => this.nextPage(values)}
        validate={validate}
        initialValues={this.state.values}
        render={({ form, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="classic-form with-description">
              {_.map(
                FIELDS,
                (fieldConfig, fieldName) => renderFormField(fieldConfig, fieldName, {
                  currencies: this.props.currencies,
                  organizations: this.props.organizations,
                }),
              )}
            </div>
            <div className="submit-buttons">
              <button type="submit" className="btn btn-outline-primary float-right btn-xs">
                <Translate id="react.default.button.next.label" defaultMessage="Next" />
              </button>
            </div>
          </form>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  translate: translateWithDefaultMessage(getTranslate(state.localize)),
  currencies: state.currencies.data,
  organizations: state.organizations.data,
  currenciesFetched: state.currencies.fetched,
  organizationsFetched: state.organizations.fetched,
});

export default withRouter(connect(mapStateToProps, {
  showSpinner, hideSpinner, fetchCurrencies, fetchOrganizations,
})(CreateInvoicePage));

CreateInvoicePage.propTypes = {
  initialValues: PropTypes.shape({
    vendor: PropTypes.shape({}),
    vendorInvoiceNumber: PropTypes.string,
    dateInvoiced: PropTypes.string,
    currencyUom: PropTypes.shape({}),
  }).isRequired,
  fetchCurrencies: PropTypes.func.isRequired,
  fetchOrganizations: PropTypes.func.isRequired,
  showSpinner: PropTypes.func.isRequired,
  hideSpinner: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  translate: PropTypes.func.isRequired,
  currenciesFetched: PropTypes.bool.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  organizations: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  organizationsFetched: PropTypes.bool.isRequired,
};
