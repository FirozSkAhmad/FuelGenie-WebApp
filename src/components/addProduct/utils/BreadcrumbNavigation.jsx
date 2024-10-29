import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BreadcrumbNavigation = () => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                Home
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/products")}>
                Products
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/location-product-list")}>
                Location Product List
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate("/view-pincodes")}>
                View Pincodes
            </Link>
            <Typography color="text.primary">Product List</Typography>
        </Breadcrumbs>
    );
};

export default BreadcrumbNavigation;
