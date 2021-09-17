/**
 * Copyright (c) 2012 Partners In Health.  All rights reserved.
 * The use and distribution terms for this software are covered by the
 * Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
 * which can be found in the file epl-v10.html at the root of this distribution.
 * By using this software in any fashion, you are agreeing to be bound by
 * the terms of this license.
 * You must not remove this notice, or any other, from this software.
 **/
package org.pih.warehouse.inventory

import org.pih.warehouse.core.RoleType
import org.pih.warehouse.shipping.Shipment
import org.pih.warehouse.shipping.ShipmentStatusCode
import org.pih.warehouse.shipping.ShipmentStatusTransitionEvent
import org.springframework.context.ApplicationListener

class StockMovementStatusEventService implements ApplicationListener<StockMovementStatusEvent> {

    boolean transactional = true

    def tmsIntegrationService

    void onApplicationEvent(StockMovementStatusEvent event) {
        log.info "Application event ${event.source} has been published"
        if (event.stockMovementStatusCode == StockMovementStatusCode.PICKING && !event.rollback) {
            tmsIntegrationService.uploadDeliveryOrder(event.source)
        }
    }
}