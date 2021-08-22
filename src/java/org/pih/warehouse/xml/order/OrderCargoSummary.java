package org.pih.warehouse.xml.order;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlType(propOrder = {"totalQuantity", "totalVolume", "totalWeight", "dangerousGoodsFlag", "totalPackagesOfDangerousGoods"})
public class OrderCargoSummary {
    private UnitTypeQuantity totalQuantity;
    private UnitTypeVolume totalVolume;
    private UnitTypeWeight totalWeight;
    private String dangerousGoodsFlag;
    private String totalPackagesOfDangerousGoods;

    public OrderCargoSummary(UnitTypeQuantity totalQuantity, UnitTypeVolume totalVolume, UnitTypeWeight totalWeight, String dangerousGoodsFlag, String totalPackagesOfDangerousGoods) {
        this.totalQuantity = totalQuantity;
        this.totalVolume = totalVolume;
        this.totalWeight = totalWeight;
        this.dangerousGoodsFlag = dangerousGoodsFlag;
        this.totalPackagesOfDangerousGoods = totalPackagesOfDangerousGoods;
    }

    public OrderCargoSummary() {
    }

    @XmlElement(name = "TotalVolume")
    public UnitTypeVolume getTotalVolume() {
        return totalVolume;
    }

    public void setTotalVolume(UnitTypeVolume totalVolume) {
        this.totalVolume = totalVolume;
    }

    @XmlElement(name = "TotalWeight")
    public UnitTypeWeight getTotalWeight() {
        return totalWeight;
    }

    public void setTotalWeight(UnitTypeWeight totalWeight) {
        this.totalWeight = totalWeight;
    }

    @XmlElement(name = "TotalQuantity")
    public UnitTypeQuantity getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(UnitTypeQuantity totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    @XmlElement(name = "DangerousGoodsFlag")
    public String getDangerousGoodsFlag() {
        return dangerousGoodsFlag;
    }

    public void setDangerousGoodsFlag(String dangerousGoodsFlag) {
        this.dangerousGoodsFlag = dangerousGoodsFlag;
    }

    @XmlElement(name = "TotalPackagesOfDangerousGoods")
    public String getTotalPackagesOfDangerousGoods() {
        return totalPackagesOfDangerousGoods;
    }

    public void setTotalPackagesOfDangerousGoods(String totalPackagesOfDangerousGoods) {
        this.totalPackagesOfDangerousGoods = totalPackagesOfDangerousGoods;
    }
}
