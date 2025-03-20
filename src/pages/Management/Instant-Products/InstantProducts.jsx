import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Pagination,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  LocalGasStation,
  OilBarrel,
  Inventory,
  History,
  ArrowUpward,
  ArrowDownward,
  Refresh,
  Update,
  Close,
  AttachMoney,
} from "@mui/icons-material";
import { format } from "date-fns";
import api from "../../../utils/api";
import BreadcrumbNavigation from "../../../components/addProduct/utils/BreadcrumbNavigation";
import CreateProductModal from "../../../components/management/InstantProducts/CreateProductModal";
import UpdatePriceModal from "../../../components/management/InstantProducts/UpdatePriceModal";
import { usePermissions } from "../../../utils/permissionssHelper";
const InstantProducts = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const permissions = usePermissions();
  const [loading, setLoading] = useState({
    products: true,
    orders: true,
    history: true,
  });
  const [error, setError] = useState({
    products: null,
    orders: null,
    history: null,
  });
  const [pagination, setPagination] = useState({
    orders: { page: 1, totalPages: 1 },
    history: { page: 1, totalPages: 1 },
  });
  const navigate = useNavigate();
  const handleRowClick = (orderId) => () => {
    navigate(
      `/management/instant-products/get-instant-orderDetails/${orderId}`
    );
  };
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading((prev) => ({ ...prev, products: true }));
      const response = await api.get(
        "/management/instant-products/get-instant-products"
      );
      setProducts(response.data.data);
      setError((prev) => ({ ...prev, products: null }));
    } catch (err) {
      setError((prev) => ({ ...prev, products: "Failed to load products" }));
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      const response = await api.get(
        `/management/instant-products/get-instant-orders?page=${page}`
      );
      setOrders(response.data.data);
      setPagination((prev) => ({
        ...prev,
        orders: {
          page: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
        },
      }));
      setError((prev) => ({ ...prev, orders: null }));
    } catch (err) {
      setError((prev) => ({ ...prev, orders: "Failed to load orders" }));
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  // Fetch price history
  const fetchPriceHistory = async (page = 1) => {
    try {
      setLoading((prev) => ({ ...prev, history: true }));
      const response = await api.get(
        `/management/instant-products/instant-product-price-updation-history?page=${page}&limit=10`
      );
      setPriceHistory(response.data.data);
      setPagination((prev) => ({
        ...prev,
        history: {
          page: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
        },
      }));
      setError((prev) => ({ ...prev, history: null }));
    } catch (err) {
      setError((prev) => ({
        ...prev,
        history: "Failed to load price history",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchPriceHistory();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageChange = (type, page) => {
    if (type === "orders") fetchOrders(page);
    if (type === "history") fetchPriceHistory(page);
  };

  const ProductCard = ({ product }) => (
    <Card sx={{ height: "100%", bgcolor: theme.palette.background.paper }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <img
            src={product.media[0]}
            alt={product.name}
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: theme.shape.borderRadius,
              marginRight: 16,
            }}
          />
          <Box>
            <Typography variant="h6">{product.name}</Typography>
            <Chip
              label={product.productType.toUpperCase()}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor:
                  product.productType === "petroleum"
                    ? theme.palette.warning.main
                    : product.productType === "gas"
                    ? theme.palette.info.main
                    : theme.palette.success.main,
                color: theme.palette.getContrastText(
                  product.productType === "petroleum"
                    ? theme.palette.warning.main
                    : product.productType === "gas"
                    ? theme.palette.info.main
                    : theme.palette.success.main
                ),
              }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Price
            </Typography>
            <Typography variant="body1">
              {product.price ? `₹${product.price}` : "Variable"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Unit
            </Typography>
            <Typography variant="body1">{product.unit}</Typography>
          </Grid>
          {product.maxDeliveryQuantity && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Max Delivery Quantity
              </Typography>
              <Typography variant="body1">
                {product.maxDeliveryQuantity}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, bgcolor: theme.palette.background.default }}>
      <BreadcrumbNavigation />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
          <Tab
            label="Products"
            icon={<Inventory />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            label="Orders"
            icon={<LocalGasStation />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            label="Price History"
            icon={<History />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>
      {tabValue === 0 && (
        <Box>
          {error.products && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error.products}
            </Alert>
          )}

          {loading.products ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Box display="flex" justifyContent="flex-end" gap={2} mb={3}>
                <Button
                  variant="contained"
                  startIcon={<Inventory />}
                  onClick={() => setCreateModalOpen(true)}
                  disabled={!permissions.create}
                >
                  Create Product
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AttachMoney />}
                  onClick={() => setUpdateModalOpen(true)}
                  disabled={!permissions.update}
                >
                  Update Prices
                </Button>
              </Box>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={product.instantProductId}
                  >
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}
      {tabValue === 1 && (
        <Box>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Tooltip title="Refresh orders">
              <IconButton onClick={() => fetchOrders(pagination.orders.page)}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          {error.orders && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error.orders}
            </Alert>
          )}

          {loading.orders ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{ bgcolor: theme.palette.background.paper }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow
                        key={order.instantOrderId}
                        onClick={handleRowClick(order.instantOrderId)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell>{order.instantOrderId}</TableCell>
                        <TableCell>
                          {format(
                            new Date(order.orderDate),
                            "dd MMM yyyy HH:mm"
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.orderStatus}
                            color={
                              order.orderStatus === "PENDING"
                                ? "warning"
                                : "success"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.paymentStatus}
                            color={
                              order.paymentStatus === "PENDING"
                                ? "error"
                                : "success"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">₹{order.grandTotal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={pagination.orders.totalPages}
                  page={pagination.orders.page}
                  onChange={(e, page) => handlePageChange("orders", page)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Box>
      )}
      {tabValue === 2 && (
        <Box>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Tooltip title="Refresh history">
              <IconButton
                onClick={() => fetchPriceHistory(pagination.history.page)}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>

          {error.history && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error.history}
            </Alert>
          )}

          {loading.history ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{ bgcolor: theme.palette.background.paper }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Adjustment</TableCell>
                      <TableCell>Price Change</TableCell>
                      <TableCell>Updated By</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {priceHistory.map((history) => (
                      <TableRow key={history.uid}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {history.adjustmentType === "inc" ? (
                              <ArrowUpward color="success" sx={{ mr: 1 }} />
                            ) : (
                              <ArrowDownward color="error" sx={{ mr: 1 }} />
                            )}
                            {history.productName}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {history.adjustmentType.toUpperCase()} ₹
                          {history.adjustmentValue}
                        </TableCell>
                        <TableCell>
                          ₹{history.oldPrice} → ₹{history.newPrice}
                        </TableCell>
                        <TableCell>{history.updatedBy}</TableCell>
                        <TableCell>
                          <Chip label={history.roleType} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={pagination.history.totalPages}
                  page={pagination.history.page}
                  onChange={(e, page) => handlePageChange("history", page)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Box>
      )}

      <CreateProductModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchProducts}
      />
      <UpdatePriceModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSuccess={fetchProducts}
        products={products}
      />
    </Box>
  );
};

export default InstantProducts;
