const ModalService        = require("services/ModalService");
const ApiService          = require("services/ApiService");

Vue.component("change-payment-method", {

    props: [
        "template",
        "currentOrder",
        "allowedPaymentMethods"
    ],

    data()
    {
        return {
            isChangePossible: false,
            changePaymentModal: {},
            encodedPaymentMethods: {},
            paymentMethod: 0,
            isPending: false
        };
    },

    created()
    {
        this.$options.template = this.template;
    },

    /**
     * Initialize the change payment modal
     */
    ready()
    {
        this.changePaymentModal = ModalService.findModal(this.$els.changePaymentModal);
        this.encodedPaymentMethods = JSON.parse(this.allowedPaymentMethods);
        this.getInitialPaymentMethod();
        this.setAllowedState();
    },

    methods:
    {
        checkChangeAllowed()
        {
            ApiService.get("/rest/io/order/payment_allowed", {orderId: this.currentOrder.order.id, paymentMethodId: this.paymentMethod})
                .done(response =>
                {
                    return response;
                })
                .fail(() =>
                {
                    return false;
                });

            return false;
        },

        setAllowedState()
        {
            this.isChangePossible = this.checkChangeAllowed();
        },

        openPaymentChangeModal()
        {
            this.getInitialPaymentMethod();

            this.changePaymentModal.show();
        },

        closeModal()
        {
            this.changePaymentModal.hide();
            this.isPending = false;
        },

        updateOrderHistory(updatedOrder)
        {
            this.currentOrder = updatedOrder;
            this.setAllowedState();

            this.closeModal();
        },

        changePaymentMethod()
        {
            this.isPending = true;

            ApiService.post("/rest/io/order/payment", {orderId: this.currentOrder.order.id, paymentMethodId: this.paymentMethod})
                .done(response =>
                {
                    this.updateOrderHistory(response);

                    document.dispatchEvent(new CustomEvent("historyPaymentMethodChanged", {detail: response}));
                })
                .fail(() =>
                {
                    this.closeModal();
                });
        },

        getInitialPaymentMethod()
        {
            for (const index in this.currentOrder.order.properties)
            {
                if (this.currentOrder.order.properties[index].typeId === 3)
                {
                    this.paymentMethod = this.currentOrder.order.properties[index].value;
                }
            }

            return false;
        }
    }

});
