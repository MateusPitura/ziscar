#!/bin/bash

source .env

# Inputs
CERT_NAME="cert-$(date +%Y%m%d)"
PUBLIC_FILE_PATH="$HOME/Downloads/cert.pem"
PRIVATE_FILE_PATH="$HOME/Downloads/privkey.pem"
CA_FILE_PATH="$HOME/Downloads/fullchain.pem"
LOAD_BALANCER_LISTNER_NAME="https-listener"
BACKEND_SET_NAME="bs_lb_2023-0831-1920"

echo "Creating certificate $CERT_NAME..."
oci lb certificate create \
    --certificate-name "$CERT_NAME" \
    --load-balancer-id "$LOAD_BALANCER_OCID" \
    --private-key-file "$PRIVATE_FILE_PATH" \
    --public-certificate-file "$PUBLIC_FILE_PATH" \
    --ca-certificate-file "$CA_FILE_PATH"

# Poll until certificate is available
echo "Waiting for certificate $CERT_NAME to be available..."
for i in {1..10}; do
    CERT_EXISTS=$(oci lb certificate list --load-balancer-id "$LOAD_BALANCER_OCID" --output json | jq -r --arg CERT_NAME "$CERT_NAME" '.data | map(select(.["certificate-name"] == $CERT_NAME)) | length')
    if [[ "$CERT_EXISTS" != "0" ]]; then
        echo "Certificate $CERT_NAME is now available."
        break
    fi
    echo "Still waiting... ($i/10)"
    sleep 15
done

# Update the listener to use the new certificate
oci lb listener update \
    --load-balancer-id "$LOAD_BALANCER_OCID" \
    --ssl-certificate-name "$CERT_NAME" \
    --listener-name "$LOAD_BALANCER_LISTNER_NAME" \
    --protocol HTTP \
    --port 443 \
    --default-backend-set-name "$BACKEND_SET_NAME" \
    --cipher-suite-name "oci-modern-ssl-cipher-suite-v1"
